"use client"
import Link from "next/link";

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
      <ul>
        <li><Link href="/posts">Posty</Link></li>
        <li><Link href="/chat">Czat</Link></li>
        <li><Link href="/profile">Profil</Link></li>
      </ul>
      <button onClick={logout}>Wyloguj</button>
    </nav>
  )
}