const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express()
const PORT = 4000

app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));


const JWT_SECRET = 'my-secret-key'

function authenticateToken(req, res, next){
  //format: Bearer <token>
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if(err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

//baza danych użytkowników
const users = [
  {id: 1, email: 'user@email.com', password: 'user123'}
]

//login endpoint
app.post('/api/login', (req, res) => {
  const {email, password} = req.body

  const user = users.find(u => u.email === email && u.password === password)
  if(!user){
    return res.status(401).json({message: "Invalid credentails"})
  }

  const token = jwt.sign({id: user.id, email: user.email}, JWT_SECRET)

  res.cookie('token', token, {httpOnly: true})
  res.json({message: 'Login successful'})
})


//endpoint do spawdzania sesji 
app.get('/api/session', (req,res) => {
  const token = req.cookie.token
  if(!token){
    return res.status(401).json({loggedIn: false})
  }

  try {
    const user = jwt.verify(token, JWT_SECRET)
    res.json({loggedIn: true, user})
  } catch{
    res.status(401).json({loggedIn: false})
  }
})


//logout endpoint
app.post('/api/logout', (req, res) => {
  res.clearCookie('token')
  res.json({message: "Logout successful"})
})

app.listen(PORT, ()=>{
  console.log(`Server running on port: ${PORT}`);
})