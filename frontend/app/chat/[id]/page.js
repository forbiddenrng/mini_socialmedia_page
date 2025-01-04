"use client"
import { useState, useEffect } from "react";
import { IoMdSend } from "react-icons/io";

import {io} from "socket.io-client"

let socket;

export default function SingleChat({params}){
  const {id} = params
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState([])

  const sendMessage = () => {
    if(inputValue && socket){
      //console.log(socket);

      socket.emit('sendMessage', {room: id, message: inputValue})
      setInputValue('')
    }
  }

  useEffect(() => {
    socket = io("http://localhost:5000")
    socket.emit('joinRoom', {room: id})

    socket.on('receiveMessage', ({message}) => {
      setMessages(prevMessages => [...prevMessages, messages.concat(message)])
    })
  }, [])

  

  return(
    <div className="single_chat">
      <h3>Witaj w czacie</h3>
      <div className="messages">
        {messages.map(message => <p key={message}>{message}</p>)}
      </div>
      <div className="chat_form">
        <input type="text" placeholder="Aa" value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
        <button onClick={() => sendMessage()}><IoMdSend/></button>
      </div>
    </div>
  )
}