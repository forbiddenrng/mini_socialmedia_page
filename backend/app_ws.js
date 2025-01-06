const express = require('express');
const {Server} = require('socket.io');
const cors = require('cors')
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'my-secret-key' 

const app = express()
app.use(cors())
app.use(express.json())



const io = new Server(app.listen(5000), {
  cors:{
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})
let votedUsers = new Set()

const voteResults = [
  {artistID: 1, artistName: "Artysta 1", totalVotes: 2},
  {artistID: 2, artistName: "Artysta 2", totalVotes: 1},
  {artistID: 3, artistName: "Artysta 3", totalVotes: 4},
]

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

  socket.on('getVotingResults', () => {
    socket.emit('receiveVotingResults', {votingResults: voteResults})
  })
  socket.on('castVote', ({token, vote}) => {
    //console.log(`Głosowanie na artystę o id: ${vote}`);
    try{
      const decoded = jwt.verify(token, JWT_SECRET)
      const userId = decoded.id
      if(!votedUsers.has(userId)){
        const targetArtist = voteResults.find(artist => artist.artistID === vote)
        targetArtist.totalVotes += 1;
        votedUsers.add(userId)
        socket.emit('receiveVotingResults', {votingResults: voteResults})

      } else{
        socket.emit('voteError', {message: "Można głosować tylko raz"})
      }
    } catch(error){
      socket.emit("voteError", {message: "Niewłaściwy token"})
    }
  })
})