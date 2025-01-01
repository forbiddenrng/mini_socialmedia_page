"use client"
import Link from "next/link";
import { CiMail } from "react-icons/ci";
import { CiChat1 } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { MdLogout } from "react-icons/md";

export default function Navigation(){
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
  return(
    <nav>
      <p>Portal Muzyczny</p>
      <ul>
        <li><CiMail/><Link href="/posts">Posty</Link></li>
        <li><CiChat1/><Link href="/chat">Czat</Link></li>
        <li><CgProfile/><Link href="/profile">Profil</Link></li>
      </ul>
      <button className="logout_btn" onClick={logout}><MdLogout /> <span>Wyloguj</span></button>
    </nav>
  )
}