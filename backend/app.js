const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mqtt = require('mqtt');
const MQTTClient = mqtt.connect("mqtt://localhost:1883")
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
  // console.log(req.headers);
  // console.log(authHeader);
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
  {id: 1, email: 'user@email.com', password: 'user1', name:"username1", city:"Gdynia", favGenre: "Rock", instrument: "Gitara", info: "Jestem fanem dobrego rocka."},
  {id: 2, email: 'user2@email.com', password: 'user2', name:"username2", city:"Gdańsk", favGenre: "Rap", instrument: "Wokal", info: "Luię śpiewać"},
  {id: 3, email: 'user3@email.com', password: 'user3', name: "username3", city:"Sopot", favGenre: "Muyka klasyczna", instrument: "Pianino", info: "Lubię muzykę klasyczną"},
]

let posts = [
  {id: 1, title: "Tytuł posta 1", ownerId: 1, createDate: "2024-12-29", modifyDate: null, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"},
  {id: 2, title: "Tytuł posta 2", ownerId: 2, createDate: "2024-12-28", modifyDate: null, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"},
  {id: 3, title: "Tytuł posta 3", ownerId: 1, createDate: "2024-12-27", modifyDate: null, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"},

]
let lastPostId = posts.length
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

// get user info endpoint
app.get('/api/user/info', authenticateToken, (req, res) => {
  const userID = req.user.id
  const user = users.find(u => u.id === userID)

  if(user){
    const userData = {
      email: user.email,
      password: user.password,
      name: user.name,
      city: user.city,
      favGenre: user.favGenre,
      instrument: user.instrument,
      info: user.info
    }
    return res.status(200).json({userData})
  }
})
//UPDATE USER PROFILE
//update user name
app.put('/api/user/name', authenticateToken, (req, res) => {
  const userID = req.user.id
  const {newUsername} = req.body

  const user = users.find(user => user.id === userID)
  if (newUsername){
    user.name = newUsername
    MQTTClient.publish('user/edit/name', JSON.stringify({userID: user.id, newUsername}))
    return res.status(200).json({message: "Zaktualizowano nazwę", newContent: newUsername})
  }
  res.status(400).json({message: "Nie podano parametru"})
})

//update user city
app.put('/api/user/city', authenticateToken, (req, res) => {
  const userID = req.user.id
  const {newCity} = req.body

  const user = users.find(user => user.id === userID)
  if (newCity){
    user.city = newCity
    MQTTClient.publish('user/edit/city', JSON.stringify({userID: user.id, newCity}))
    return res.status(200).json({message: "Zaktualizowano miasto", newContent: newCity})
  }
  res.status(400).json({message: "Nie podano parametru"})
})

//update user city
app.put('/api/user/genre', authenticateToken, (req, res) => {
  const userID = req.user.id
  const {newGenre} = req.body

  const user = users.find(user => user.id === userID)
  if (newGenre){
    user.favGenre = newGenre
    MQTTClient.publish('user/edit/genre', JSON.stringify({userID: user.id, newGenre}))
    return res.status(200).json({message: "Zaktualizowano gatunek muzyczny", newContent: newGenre})
  }
  res.status(400).json({message: "Nie podano parametru"})
})

//update user instrument
app.put('/api/user/instrument', authenticateToken, (req, res) => {
  const userID = req.user.id
  const {newInstrument} = req.body

  const user = users.find(user => user.id === userID)
  if (newInstrument){
    user.instrument = newInstrument
    MQTTClient.publish('user/edit/instrument', JSON.stringify({userID: user.id, newInstrument}))
    return res.status(200).json({message: "Zaktualizowano instrument", newContent: newInstrument})
  }
  res.status(400).json({message: "Nie podano parametru"})
})

//update user info
app.put('/api/user/info', authenticateToken, (req, res) => {
  const userID = req.user.id
  const {newInfo} = req.body

  const user = users.find(user => user.id === userID)
  if (newInfo){
    user.info = newInfo
    MQTTClient.publish('user/edit/info', JSON.stringify({userID: user.id}))
    return res.status(200).json({message: "Zaktualizowano informacje", newContent: newInfo})
  }
  res.status(400).json({message: "Nie podano parametru"})
})

//update user email
app.put('/api/user/email', authenticateToken, (req, res) => {
  const userID = req.user.id
  const {newEmail} = req.body

  const user = users.find(user => user.id === userID)
  if (newEmail){
    user.email = newEmail    
    MQTTClient.publish('user/edit/email', JSON.stringify({userID: user.id, newEmail}))
    return res.status(200).json({message: "Zaktualizowano email", newContent: newEmail})
  }
  res.status(400).json({message: "Nie podano parametru"})
})
//update user password
app.put('/api/user/password', authenticateToken, (req, res) => {
  const userID = req.user.id
  const {newPassword} = req.body

  const user = users.find(user => user.id === userID)
  if (newPassword){
    user.password = newPassword
    MQTTClient.publish('user/edit/password', JSON.stringify({userID: user.id}))
    return res.status(200).json({message: "Zaktualizowano hasło", newContent: newPassword})
  }
  res.status(400).json({message: "Nie podano parametru"})
})

//geting other users info endpoint
app.get('/api/users/info', (req, res) => {
  const {expression} = req.query
  //console.log(expression);

  //searching people usernames by expression
  const matchingUsers = users.filter(user => user.name.includes(expression))

  if(matchingUsers.length > 0){
    //selecting only info we want
    const usersInfo = matchingUsers.map(user => ({
      id: user.id,
      name: user.name,
      city: user.city,
      favGenre: user.favGenre,
      instrument: user.instrument,
      info: user.info
    }))
    return res.status(200).json({usersInfo})
  }
  res.status(404).json({message: "Nie znaleziono użytkownika"})
})


//add post endpoint

app.post('/api/post/add', authenticateToken, (req, res) => {
  const {title, content} = req.body

  if (!title || !content){
    res.status(400).json({message: "Niepopawny request"})
  }
  lastPostId++;
  const newPost = {
    id: lastPostId,
    title: title,
    createDate: new Date().toISOString().slice(0,10),
    modifyDate: null,
    ownerId: req.user.id,
    content: content,
  }

  posts.push(newPost)
  MQTTClient.publish('post/add', JSON.stringify(newPost))
  res.status(201).json({message: "Utworzono nowy post"})
})

//edit post endpoint

app.put('/api/post/edit', authenticateToken, (req, res) => {
  const {newContent, newTitle, postId} = req.body

  console.log(req.body);

  console.log(newContent, newTitle, postId);
  const post = posts.find(post => post.id === postId)

  if(post){
    post.title = newTitle
    post.content = newContent
    post.modifyDate = new Date().toISOString().slice(0,10)
  }
  MQTTClient.publish('post/edit', JSON.stringify({id: post.id, ownerId: post.ownerId}))
  return res.status(200).json({message: "Zmodyfikowano zawartość posta"})
})

//delete post endpoint
app.delete('/api/post/delete', authenticateToken, (req, res) => {
  const {postId} = req.body
  //const postIdx = posts.findIndex(post => post.id === postId)
  const {id, ownerId} = posts.find(post => post.id === postId)
  posts = posts.filter(post => post.id !== postId)
  MQTTClient.publish('post/delete', JSON.stringify({id, ownerId}))
  return res.status(200).json({message: "Post usunięty pomyślnie"})
 
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

//register endpoint
app.post('/api/register', (req, res) => {
  const {email, password, username} = req.body

  const existingUser = users.find(u => u.email === email)
  if(existingUser){
    return res.status(400).json({message: "User already exists"})
  }

  const newUser = {
    id: users.length + 1,
    email, 
    password, 
    name:username, 
    city:"", 
    favGenre: "", 
    instrument: "", 
    info: ""
  }
  users.push(newUser);

  const token = jwt.sign({id: newUser.id, email: newUser.email}, JWT_SECRET)
  
  res.cookie('token', token, {httpOnly: true, secure: false})
  res.status(201).json({token: token})
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