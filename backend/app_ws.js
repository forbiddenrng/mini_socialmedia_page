const express = require('express');
const {Server} = require('socket.io');
const cors = require('cors')
require("dotenv").config()
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET

const app = express()
app.use(cors())
app.use(express.json())

const charts = [
  {id: 1, song: "Piosenka 1", artist: "Artysta 1", votes: 10},
  {id: 2, song: "Piosenka 2", artist: "Artysta 2", votes: 20},
  {id: 3, song: "Piosenka 3", artist: "Artysta 3", votes: 35},
  {id: 4, song: "Piosenka 4", artist: "Artysta 4", votes: 40},
  {id: 5, song: "Piosenka 5", artist: "Artysta 5", votes: 51},
]

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
        io.emit('receiveVotingResults', {votingResults: voteResults})

      } else{
        socket.emit('voteError', {message: "Można głosować tylko raz"})
      }
    } catch(error){
      socket.emit("voteError", {message: "Niewłaściwy token"})
    }
  })

  socket.on('getCharts', () => {
    socket.emit('updateCharts', {charts})
  })

  //update charts 
  const intervalID = setInterval(() => {
    //console.log("send message");
    const randomSongIdx = Math.floor(Math.random() * charts.length)

    // random new votes between 5 and 20
    const votes = Math.floor(Math.random() * 16) + 5
    charts[randomSongIdx].votes += votes

    socket.emit("updateCharts",{charts} )
  }, 5000)
})


