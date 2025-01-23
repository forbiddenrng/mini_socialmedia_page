"use client"
import '../globals.css'

import mqtt from "mqtt"
import { useEffect, useState } from 'react'

export default function Home() {

  const [loggedUsers, setLoggedUsers] = useState([])


  const getLoggedUsers = async () => {
    const request = fetch('http://localhost:4000/api/users/logged', {
      method: "GET"
    }).then(res => {
      if(res.ok) return res.json()
    }).then(res => {
      setLoggedUsers(res.loggedUsers)
    }).catch(e =>{
      console.error(e)
    })

  }

  useEffect(() => {

    getLoggedUsers()

    const client = mqtt.connect("ws://localhost:8000/mqtt")

    client.on('connect', () => {
      
      client.subscribe(['user/online', 'user/offline'])
    })
    client.on('message', (topic, message) => {
      if(topic === 'user/online'){
        const newUser = JSON.parse(message)
        setLoggedUsers(prev => [...prev, newUser])
      } else if(topic === 'user/offline'){
        console.log("user offline")
        const offlineUser = JSON.parse(message)
        setLoggedUsers(prev => prev.filter(user => user.id !== offlineUser.id))
      }
    })
    return () => {
      client.end()
    }
    }, [])

    
  return (
    <div>
      <h1 className='home_header'><span className='jam'>Jam</span><span className='space'>Space</span></h1>
      <div className='logged_users_section'>
        <h3>Użytkownicy online</h3>
        <div className='logged_users'>
          {loggedUsers.map(user => (
            <div key={user.id}>
              <span>{user.name}</span>
              <span className='logged_icon'></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
