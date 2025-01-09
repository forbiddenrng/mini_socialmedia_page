"use client"
import Link from "next/link";
import { CiMail } from "react-icons/ci";
import { CiChat1 } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { MdLogout } from "react-icons/md";
import { BsPeopleFill } from "react-icons/bs";
import { LuVote } from "react-icons/lu";
import { FaItunesNote, FaBell } from "react-icons/fa";

import mqtt from "mqtt"
import { useEffect, useState } from "react";

export default function Navigation(){
  const [newPosts, setNewPosts] = useState(false) 

  const logout = async () => {
    const response = await fetch('http://localhost:4000/api/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: "include"
    })
    if(response.ok){
      alert("Wylogowano")
    } else{
      alert("Problem podczas wylogowywania")
    }
    
    
  }
    useEffect(() => {
    // console.log(mqtt)
    const client = mqtt.connect("ws://localhost:8000/mqtt")

    client.on('connect', () => {
      
      client.subscribe('post/add')
    })
    client.on('message', (topic, message) => {
      if(topic === 'post/add'){
        setNewPosts(true)
      } else if(topic === 'post/read'){
        setNewPosts(false)
      }
    })
    return () => {
      client.end()
    }
  }, [])

  return(
    <nav>
      <p>Portal Muzyczny</p>
      <ul>
        <li><CiMail/><Link href="/posts">Posty</Link>{newPosts && <span className="new_posts"><FaBell/></span>}</li>
        <li><CiChat1/><Link href="/chat">Czat</Link></li>
        <li><CgProfile/><Link href="/profile">Profil</Link></li>
        <li><BsPeopleFill/><Link href="/community">Społeczność</Link></li>
        <li><LuVote/><Link href="/vote">Głosuj</Link></li>
        <li><FaItunesNote/><Link href="/charts">Lista przebojów</Link></li>
      </ul>
      <button className="logout_btn" onClick={logout}><MdLogout /> <span>Wyloguj</span></button>
    </nav>
  )
}