const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const cors = require('cors');
const mqtt = require('mqtt');
const {v4} = require('uuid');
const MQTTClient = mqtt.connect("mqtt://localhost:1883")
const app = express()
const PORT = 4000

require("dotenv").config()

// MONGO DB
const mongoose = require("mongoose")
const User = require("./models/users")
const Post = require("./models/posts")

mongoose.connect(`${process.env.DATABASE_URL}`, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log("Connected to database"))



app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors({ 
  origin: 'http://localhost:3000', 
  credentials: true,
}));


const JWT_SECRET = process.env.JWT_SECRET

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
  {id: v4(), email: 'user@email.com', password: 'user1', name:"username1", city:"Gdynia", favGenre: "Rock", instrument: "Gitara", info: "Jestem fanem dobrego rocka."},
  {id: v4(), email: 'user2@email.com', password: 'user2', name:"username2", city:"Gdańsk", favGenre: "Rap", instrument: "Wokal", info: "Luię śpiewać"},
  {id: v4(), email: 'user3@email.com', password: 'user3', name: "username3", city:"Sopot", favGenre: "Muyka klasyczna", instrument: "Pianino", info: "Lubię muzykę klasyczną"},
]

let posts = [
  {id: v4(), title: "Tytuł posta 1", ownerId: users[0].id, createDate: "2024-12-29", modifyDate: null, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"},
  {id: v4(), title: "Tytuł posta 2", ownerId: users[1].id, createDate: "2024-12-28", modifyDate: null, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"},
  {id: v4(), title: "Tytuł posta 3", ownerId: users[0].id, createDate: "2024-12-27", modifyDate: null, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"},

]
//get posts endpoint

app.get('/api/posts', async (req, res) => {
  // console.log("reqest");
  // res.json({posts: posts})
  try {
    const posts = await Post.find()
    res.json({posts: posts})
  } catch (err){
    return res.status(500).json({message: err.message})
  }
})

//get post by id

app.get('/api/post:id', async (req, res) => {
  const postId = req.params.id
  // const post = posts.find(p => p.id === postId)
  
  // if(post){
  //   res.json(post)
  // } else {
  //   res.status(404).json({message: "Post not found"})
  // }
  try{
    const post = await Post.findById(postId)
    if (post){
      return res.json(post)
    }else {
      return res.status(404).json({message: "Post not found"})
    }
  } catch(err){
    return res.status(500).json({message: err.message})
  }
})


// get logged user posts
app.get('/api/user/posts', authenticateToken, async (req, res) =>{
  const userId = req.user.id
  // console.log(userId);
  // const userPosts = posts.filter(post => post.ownerId === userId).map(post => post.id)
  // console.log(posts.map(post => post.ownerId));
  // console.log(userPosts);
  // res.json({posts: userPosts})

  try{
    const userPosts = await Post.find({ownerId: userId})
    if(userPosts){
      const userPostsIds = userPosts.map(post => post._id)
      res.json({posts: userPostsIds})
    }
  } catch(err){
    return res.status(500).json({message: err.message})
  }
})

// get user info endpoint
app.get('/api/user/info', authenticateToken, async (req, res) => {
  const userID = req.user.id
  // const user = users.find(u => u.id === userID)

  try{
    const user = await User.findById(userID)
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
  }catch(err){
    return res.status(500).json({message: err.messagae})
  }

})
//UPDATE USER PROFILE
//update user name
app.put('/api/user/name', authenticateToken, async (req, res) => {
  const userID = req.user.id
  const {newUsername} = req.body

  try{
    if(newUsername){
      const newUser = await User.findByIdAndUpdate(userID, {name: newUsername}, {new: true})
      MQTTClient.publish('user/edit/name', JSON.stringify({userID: newUser._id, newUsername}))
      return res.status(200).json({message: "Zaktualizowano nazwę", newContent: newUsername})
    } else {
      res.status(400).json({message: "Nie podano parametru"})
    }
  }catch (err){
    return res.status(500).json({message: err.message})
  }

})

//update user city
app.put('/api/user/city', authenticateToken, async (req, res) => {
  const userID = req.user.id
  const {newCity} = req.body

  try{
    if(newCity){
      const newUser = await User.findByIdAndUpdate(userID, {city: newCity}, {new: true})
      MQTTClient.publish('user/edit/city', JSON.stringify({userID: newUser._id, newCity}))
      return res.status(200).json({message: "Zaktualizowano miasto", newContent: newCity})
    } else {
      res.status(400).json({message: "Nie podano parametru"})
    }
  }catch (err){
    return res.status(500).json({message: err.message})
  }

})

//update user genre
app.put('/api/user/genre', authenticateToken, async (req, res) => {
  const userID = req.user.id
  const {newGenre} = req.body

  try{
    if(newGenre){
      const newUser = await User.findByIdAndUpdate(userID, {favGenre: newGenre}, {new: true})
      MQTTClient.publish('user/edit/genre', JSON.stringify({userID: newUser._id, newGenre}))
      return res.status(200).json({message: "Zaktualizowano gatunek", newContent: newGenre})
    } else {
      res.status(400).json({message: "Nie podano parametru"})
    }
  }catch (err){
    return res.status(500).json({message: err.message})
  }
})

//update user instrument
app.put('/api/user/instrument', authenticateToken, async (req, res) => {
  const userID = req.user.id
  const {newInstrument} = req.body

  try{
    if(newInstrument){
      const newUser = await User.findByIdAndUpdate(userID, {instrument: newInstrument}, {new: true})
      MQTTClient.publish('user/edit/instrument', JSON.stringify({userID: newUser._id, newInstrument}))
      return res.status(200).json({message: "Zaktualizowano instrument", newContent: newInstrument})
    } else {
      res.status(400).json({message: "Nie podano parametru"})
    }
  }catch (err){
    return res.status(500).json({message: err.message})
  }

})

//update user info
app.put('/api/user/info', authenticateToken, async (req, res) => {
  const userID = req.user.id
  const {newInfo} = req.body

  try{
    if(newInfo){
      const newUser = await User.findByIdAndUpdate(userID, {info: newInfo}, {new: true})
      MQTTClient.publish('user/edit/info', JSON.stringify({userID: newUser._id, newInfo}))
      return res.status(200).json({message: "Zaktualizowano informacje", newContent: newInfo})
    } else {
      res.status(400).json({message: "Nie podano parametru"})
    }
  }catch (err){
    return res.status(500).json({message: err.message})
  }

})

//update user email
app.put('/api/user/email', authenticateToken, async (req, res) => {
  const userID = req.user.id
  const {newEmail} = req.body

  try{
    if(newEmail){
      const newUser = await User.findByIdAndUpdate(userID, {email: newEmail}, {new: true})
      MQTTClient.publish('user/edit/email', JSON.stringify({userID: newUser._id, newEmail}))
      return res.status(200).json({message: "Zaktualizowano email", newContent: newEmail})
    } else {
      res.status(400).json({message: "Nie podano parametru"})
    }
  }catch (err){
    return res.status(500).json({message: err.message})
  }

})
//update user password
app.put('/api/user/password', authenticateToken, async (req, res) => {
  const userID = req.user.id
  const {newPassword} = req.body

  try{
    if(newPassword){
      const newUser = await User.findByIdAndUpdate(userID, {password: newPassword}, {new: true})
      MQTTClient.publish('user/edit/password', JSON.stringify({userID: newUser._id}))
      return res.status(200).json({message: "Zaktualizowano hasło", newContent: newPassword})
    } else {
      res.status(400).json({message: "Nie podano parametru"})
    }
  }catch (err){
    return res.status(500).json({message: err.message})
  }

})

//geting other users info endpoint
app.get('/api/users/info', async (req, res) => {
  const {expression} = req.query
  //console.log(expression);

  try {
    const matchingUsers = await User.find({name: {$regex: expression, $options: "i"}})
    if(matchingUsers){
      const usersInfo = matchingUsers.map(user => ({
        id: user._id,
        name: user.name,
        city: user.city,
        favGenre: user.favGenre,
        instrument: user.instrument,
        info: user.info
      }))
      return res.status(200).json({usersInfo})
    } else {
      res.status(404).json({message: "Nie znaleziono użytkownika"})
    }
  }catch(err){
    return res.status(500).json({message: err.messagae})
  }

})


//add post endpoint

app.post('/api/post/add', authenticateToken, async (req, res) => {
  const {title, content} = req.body

  if (!title || !content){
    res.status(400).json({message: "Niepopawny request"})
  }

  try {
    const createDate = new Date().toISOString().slice(0,10)
    const newPost = new Post({
      title,
      ownerId: req.user.id,
      createDate,
      content,
      modifyDate: null
    })
    const savedPost = await newPost.save()
    res.status(201).json({message: "Utworzono nowy post"})
    MQTTClient.publish('post/add', JSON.stringify(newPost))
  } catch (err){
    return res.status(500).json({message: err.message})
  }
  
  // const newPost = {
  //   id: v4(),
  //   title: title,
  //   createDate: new Date().toISOString().slice(0,10),
  //   modifyDate: null,
  //   ownerId: req.user.id,
  //   content: content,
  // }

  // posts.push(newPost)
  // MQTTClient.publish('post/add', JSON.stringify(newPost))
  // res.status(201).json({message: "Utworzono nowy post"})
})

//edit post endpoint

app.put('/api/post/edit', authenticateToken, async (req, res) => {
  const {newContent, newTitle, postId} = req.body

  // console.log(req.body);

  // console.log(newContent, newTitle, postId);
  // const post = posts.find(post => post.id === postId)
  try{
    const updatedPost = await Post.findByIdAndUpdate(
      postId, 
      {
        title: newTitle,
        content: newContent,
        modifyDate: new Date().toISOString().slice(0,10)
      },
      {new: true}
    )

    if(updatedPost){
      MQTTClient.publish('post/edit', JSON.stringify({id: updatedPost._id, ownerId: updatedPost.ownerId}))
      res.status(200).json({message: "Zmodyfikowano zawartość posta"})
    }
  } catch (err) {
    console.log("Bład")
    return res.status(500).json({message: err.message})
  }
  // if(post){
  //   post.title = newTitle
  //   post.content = newContent
  //   post.modifyDate = new Date().toISOString().slice(0,10)
  // }
  // MQTTClient.publish('post/edit', JSON.stringify({id: post.id, ownerId: post.ownerId}))
  // return res.status(200).json({message: "Zmodyfikowano zawartość posta"})
})

//delete post endpoint
app.delete('/api/post/delete', authenticateToken, async (req, res) => {
  const {postId} = req.body

  try {
    const deletedPost = await Post.findByIdAndDelete(postId)
    if(deletedPost){
      MQTTClient.publish('post/delete', JSON.stringify({id: deletedPost._id, ownerId: deletedPost.ownerId}))
      return res.status(200).json({message: "Post usunięty pomyślnie"})
    }
  } catch (err){
    return res.status(500).json({message: err.message})
  }
  //const postIdx = posts.findIndex(post => post.id === postId)
  // const {id, ownerId} = posts.find(post => post.id === postId)
  // posts = posts.filter(post => post.id !== postId)
  // MQTTClient.publish('post/delete', JSON.stringify({id, ownerId}))
  // return res.status(200).json({message: "Post usunięty pomyślnie"})
 
})




//login endpoint
app.post('/api/login', async (req, res) => {
  const {email, password} = req.body


  // const user = users.find(u => u.email === email && u.password === password)
  // if(!user){
  //   return res.status(401).json({message: "Invalid credentails"})
  // }

  try{
    const user = await User.findOne({email: email, password: password})
    if(user){
      const token = jwt.sign({id: user._id, email: user.email}, JWT_SECRET)

      res.cookie('token', token, {httpOnly: true, secure: false})
    
      res.json({token: token})
    }
    else return res.status(401).json({message: "Invalid credentails"})
  } catch (e){
    return res.status(500).json({message: e.message})
  }

  // const token = jwt.sign({id: user.id, email: user.email}, JWT_SECRET)

  // res.cookie('token', token, {httpOnly: true, secure: false})

  // res.json({token: token})
})

//register endpoint
app.post('/api/register', async (req, res) => {
  const {email, password, username} = req.body

  // const existingUser = users.find(u => u.email === email)
  // if(existingUser){
  //   return res.status(400).json({message: "User already exists"})
  // }

  try {
    const userExists = await User.findOne({email: email})
    if(userExists){
      return res.status(400).json({message: "User already exists"})
    }

    const newUser = new User({email, password, name:username})
    const savedUser = await newUser.save()

    const token = jwt.sign({id: savedUser._id, email: savedUser.email}, JWT_SECRET)
  
    res.cookie('token', token, {httpOnly: true, secure: false})
    res.status(201).json({token: token})
  } catch (error){
    return res.status(500).json({message: error.message})
  }

  // const newUser = {
  //   id: v4(),
  //   email, 
  //   password, 
  //   name:username, 
  //   city:"", 
  //   favGenre: "", 
  //   instrument: "", 
  //   info: ""
  // }
  // users.push(newUser);

  // const token = jwt.sign({id: newUser.id, email: newUser.email}, JWT_SECRET)
  
  // res.cookie('token', token, {httpOnly: true, secure: false})
  // res.status(201).json({token: token})
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