'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import '../globals.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const router = useRouter()

  const handleSubmit = async (e) =>{
    e.preventDefault()

    const response = await fetch('http://localhost:4000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({email, password}),
      credentials: "include"
    })

    if(response.ok){
      router.push('/')
    }else{
      alert("Niepoprawne logowanie")
    }
  }
  return (
    <div>
      Login Page
      <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit">Login</button>
      </form>
    </div>
  );
}
