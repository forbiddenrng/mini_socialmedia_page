const express = require('express');
const {Server} = require('socket.io');
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const io = new Server(app.listen(5000), {
  cors:{
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

io.on('connection', (socket) => {
  console.log(`Użytkownik połączony: ${socket.id}`);

  let roomID = null

  socket.on('joinRoom', ({room}) => {
    //console.log("Połączono użytkownika");
    //console.log(room);
    socket.join(room)
    roomID = room
  })
  socket.on('sendMessage', ({room, message}) => {
    socket.broadcast.to(roomID).emit('receiveMessage', {message})
  })
})