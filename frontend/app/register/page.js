'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdOutlineEmail } from "react-icons/md";
import { IoLockClosedOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";

import '../globals.css'
import '../style/login.css'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayError, setDisplayError] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e) =>{
    e.preventDefault()
    if(email === "" || password==="" || username === ""){
      setDisplayError(true)
      return 
    }
    let responseOk = false
    const response = await fetch('http://localhost:4000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({email, password, username}),
      credentials: "include"
    }).then(res => {
      responseOk = res.ok
      if (res.ok) return res.json()
    })
    .then(res => {
      if (res.status === 400) {
      setDisplayError(true);
      throw new Error('Bad Request');
      }
      sessionStorage.setItem('token', res.token)
    }).catch(e => {
      alert("Konto z takim adresem email już istenieje")
    })

    if(responseOk){
      router.push('/home')
    }
  }
  const handleSignIn = () => {
    // console.log("sign up");
    router.push('/login')
  }
  useEffect(() => {
    setDisplayError(false)
  }, [email, password])
  return (
    <div className='login_page'>
      <div className='login_wrapper'>
      <h3>Sign up</h3>
      <form onSubmit={handleSubmit}>
      <div className='email'>
      <label>
      <MdOutlineEmail className='form_icon'/>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
        />
      </label>
      </div>
      <div className='username'>
      <label>
      <FaRegUser className='form_icon'/>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='Nazwa użytkownika'
        />
      </label>
      </div>

      <div className='password'>
      <label>
        <IoLockClosedOutline className='form_icon'/>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
        />
      </label>
      </div>
      <button type="submit">Sign up</button>
      </form>
      <div className='sign_up'>
        <span onClick={() => handleSignIn()}>Sign in</span>
      </div>
      {displayError && <span className='form_error'>Email, nazwa i hasło są wymagane</span>}
      </div>
    </div>
  );
}