'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdOutlineEmail } from "react-icons/md";
import { IoLockClosedOutline } from "react-icons/io5";

import '../globals.css'
import '../style/login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // const [displayError, setDisplayError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const router = useRouter()

  const handleSubmit = async (e) =>{
    e.preventDefault()
    if(email === "" || password===""){
      setErrorMessage('Email i hasło muszą być podane')
      return 
    }
    let responseOk = false
    const response = await fetch('http://localhost:4000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({email, password}),
      credentials: "include"
    }).then(res => {
      responseOk = res.ok
      return res.json()
    }).then(res => {
      sessionStorage.setItem('token', res.token)
    })

    if(responseOk){
      router.push('/home')
    }else{
      setErrorMessage('Niepoprawne dane logowania')
    }
  }
  const handleSignUp = () => {
    // console.log("sign up");
    router.push('/register')
  }
  useEffect(() => {
    setErrorMessage('')
  }, [email, password])
  return (
    <div className='login_page'>
      <div className='login_wrapper'>
      <h3>Login</h3>
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
      <button type="submit">Login</button>
      </form>
      <div className='sign_up'>
        <span onClick={() => handleSignUp()}>Sign up</span>
      </div>
      {errorMessage !== '' && <span className='form_error'>{errorMessage}</span>}
      </div>
    </div>
  );
}