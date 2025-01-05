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
  socket.on('sendMessage', ({room, message, username}) => {
    console.log(room, message, username);
    const now = new Date()
    const day = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate()
    const month = now.getMonth() < 10 ? `0${now.getMonth()+1}` : now.getMonth()+1

    const hours = now.getHours() < 10 ? `0${now.getHours()}` : now.getHours()
    const minutes = now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes()

    const messageDate = `${day}-${month}-${now.getFullYear()} ${hours}:${minutes}`

    io.to(roomID).emit('receiveMessage', {message, username, date: messageDate})
  })
})