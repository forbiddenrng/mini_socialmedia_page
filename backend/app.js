const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express()
const PORT = 4000

app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors({ 
  origin: 'http://localhost:3000', 
  credentials: true,
}));


const JWT_SECRET = 'my-secret-key'

function authenticateToken(req, res, next){
  //format: Bearer <token>
  const authHeader = req.headers['authorization']
  console.log(req.headers);
  console.log(authHeader);
  let token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if(err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

//baza danych użytkowników
const users = [
  {id: 1, email: 'user@email.com', password: 'user1'},
  {id: 2, email: 'user2@email.com', password: 'user2'},
  {id: 3, email: 'user3@email.com', password: 'user3'},
]

const posts = [
  {id: 1, title: "Tytuł posta 1", ownerId: 1, createDate: "2024-12-29", modifyDate: null, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"},
  {id: 2, title: "Tytuł posta 2", ownerId: 2, createDate: "2024-12-28", modifyDate: null, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"},
  {id: 3, title: "Tytuł posta 3", ownerId: 1, createDate: "2024-12-27", modifyDate: null, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"},

]

//get posts endpoint

app.get('/api/posts', (req, res) => {
  console.log("reqest");
  res.json({posts: posts})
})

//get post by id

app.get('/api/post:id', (req, res) => {
  const postId = parseInt(req.params.id, 10)
  const post = posts.find(p => p.id === postId)
  
  if(post){
    res.json(post)
  } else {
    res.status(404).json({message: "Post not found"})
  }
})

// get logged user posts
app.get('/api/user/posts', authenticateToken, (req, res) =>{
  const userId = req.user.id
  const userPosts = posts.filter(post => post.ownerId === userId).map(post => post.id)

  res.json({posts: userPosts})
})



//login endpoint
app.post('/api/login', (req, res) => {
  const {email, password} = req.body

  const user = users.find(u => u.email === email && u.password === password)
  if(!user){
    return res.status(401).json({message: "Invalid credentails"})
  }

  const token = jwt.sign({id: user.id, email: user.email}, JWT_SECRET)

  res.cookie('token', token, {httpOnly: true, secure: false})

  res.json({token: token})
})


//endpoint do spawdzania sesji 
app.get('/api/session', (req,res) => {
  const token = req.cookies.token
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