"use client"
import { useState, useEffect } from "react";
import { IoMdSend } from "react-icons/io";

import {io} from "socket.io-client"

import "@/app/style/chat.css"


export default function SingleChat({params}){
  const {id} = params
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState([])

  const [username, setUsername] = useState('')
  const [token, setToken] = useState()

  const [socket, setSocket] = useState(null)

  const getUsername = async () => {
    const request = await fetch('http://localhost:4000/api/user/info', {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: "include"
    }).then(res => {
      if(res.ok){
        return res.json()
      }
    }).then(res => {
      setUsername(res.userData.name)
    }).catch(e => {
      console.log("Nie udało się pobrać nazwy użytkownika")
    })
  }

  const sendMessage = () => {
    if(inputValue && socket){
      //console.log(socket);

      socket.emit('sendMessage', {room: id, message: inputValue, username: username})
      setInputValue('')
    }
  }

  useEffect(() => {
    setToken(sessionStorage.getItem('token'))
    const newSocket = io("http://localhost:5000")
    setSocket(newSocket)
    newSocket.emit('joinRoom', {room: id})

    newSocket.on('receiveMessage', ({message, username, date}) => {
      console.log(message, username, date);
      setMessages(prevMessages => [...prevMessages,{message, username,date}])
    })
    return () => {
      newSocket.disconnect()
    }
  }, [id])

  useEffect(() => {
    if(token){
      getUsername()
    }
  }, [token])
  

  return(
    <div className="single_chat">
      <h3>Witaj w czacie</h3>
      <div className="chat_wrapper">
      <div className="messages">
        {messages.map((message,i) => <Message key={i} {...message} own={message.username === username}/>)}
      </div>
      <div className="chat_form">
        <input type="text" placeholder="Aa" value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
        <button onClick={() => sendMessage()}><IoMdSend/></button>
      </div>
      </div>
    </div>
  )
}

function Message({message, username, date, own}){

  return(
    <div className={`chat_message${own ? ' own_message' : ""}`}>
      <div className="message_info">
      {!own && <span>{username}</span>}<span>{date}</span>
      </div>
      <p className="message_content">{message}</p>
    </div>
  )
}