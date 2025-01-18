"use client"
import "../style/profile.css"

import { MdEdit } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { BiShow, BiHide } from "react-icons/bi";
import { useState, useEffect } from "react";
import DeleteAccount from "../components/DeleteAccount";


export default function Profile() {
  //state for edit management
  const [editName, setEditName] = useState(false)
  const [nameValue, setNameValue] = useState('')

  const [editCity, setEditCity] = useState(false)
  const [cityValue, setCityValue] = useState('')

  const [editGenre, setEditGenre] = useState(false)
  const [genreValue, setGenreValue] = useState('')

  const [editInstrument, setEditInstrument] = useState(false)
  const [instrumentValue, setInstrumentValue] = useState('')

  const [editInfo, setEditInfo] = useState(false)
  const [infoValue, setInfoValue] = useState('')

  //state for token
  const [token, setToken] = useState()

  //state for user info
  const [username, setUsername] = useState('Brak danych')
  const [city, setCity] = useState('Brak danych')
  const [favGenre, setFavGenre] = useState('Brak danych')
  const [instrument, setInstrument] = useState('Brak danych')
  const [info, setInfo] = useState('Brak danych')
  
  useEffect(() => {
    if (typeof window !== 'undefined'){
      setToken(sessionStorage.getItem('token'))
    }
  }, [])
  
  const saveUserInfo = ({userData}) => {
    setUsername(userData.name)
    setCity(userData.city)
    setFavGenre(userData.favGenre)
    setInstrument(userData.instrument)
    setInfo(userData.info)
  }

  const getUserInfo = async () => {
    const response = fetch('http://localhost:4000/api/user/info', {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      credentials: "include"
    }).then(res => res.json())
    .then(res => {
      saveUserInfo(res)
    }).catch(e => {
      alert("Nie udało się załadować danych")
    })
  }
  useEffect(() => {
    if(token){
      getUserInfo()
    }
  }, [token])

  const clearInuput = (inputName) => {
    if (inputName === 'name') return setNameValue('')
    else if (inputName === 'city') return setCityValue('')
    else if (inputName === 'genre') return setGenreValue('')
    else if (inputName === 'instrument') return setInstrumentValue('')
    else if (inputName === 'info') return setInfoValue('')
  }

  const setNewContent = (endpoint, newContent) => {
    if (endpoint === 'name') return setUsername(newContent)
    else if(endpoint === 'city') return setCity(newContent)
    else if(endpoint === 'genre') return setFavGenre(newContent)
    else if(endpoint === 'instrument') return setInstrument(newContent)
    else if(endpoint === 'info') return setInfo(newContent)

  }

  const sendEditReqest = async (endpoint, key, value) => {
    const bodyObj = {
      [key]: value
    }
    const request = fetch(`http://localhost:4000/api/user/${endpoint}`, {
      method: "PUT",
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: "include",
      body:JSON.stringify(bodyObj)
    }).then(res => {
      if(res.ok) return res.json()
    }).then(res => {
      setNewContent(endpoint, res.newContent)
    })
      .catch(e => alert("Wystąpił błąd poczas edytowania"))
      .finally(() => {
        //clear input
        clearInuput(endpoint)
      })
  }
  //check if there are spaces in input
  const veryfiyInput = str => !str.includes(' ') && str.length >0

  const handleConfirmEdit = (edit) => {
    if(edit === 'name'){
      if(!veryfiyInput(nameValue)) return alert("Proszę podać nową wartość")
      setEditName(false)
      sendEditReqest('name', 'newUsername', nameValue)
    }else if(edit==='city'){
      if(!veryfiyInput(cityValue)) return alert("Proszę podać nową wartość")
      setEditCity(false)
      sendEditReqest('city', 'newCity', cityValue)
    }else if(edit==='genre'){
      if(genreValue === "") return alert("Proszę podać nową wartość")
      setEditGenre(false)
      sendEditReqest('genre', 'newGenre', genreValue)
    } else if(edit==='instrument'){
      if(instrumentValue === "") return alert("Proszę podać poprawną wartość")
      setEditInstrument(false)
      sendEditReqest('instrument', 'newInstrument', instrumentValue)
    } else if(edit==='info'){
      if(infoValue === "") return alert("Proszę podać poprawną wartość")
      setEditInfo(false)
      sendEditReqest('info', 'newInfo', infoValue)
    }
  }


  return (
    <div>
     <h1 className="welcome">Witaj!</h1>
     <div className="user_info">
      <h3>Informacje o Tobie</h3>
      <div className="info_box">
        <div className="info_title">Nazwa:</div>
        <div className="info_content">
          {editName ? <input className="edit_input" onChange={(e) => setNameValue(e.target.value)} value={nameValue}></input> : <span>{username}</span>}
        </div>
        <div className="edit_btn">
          {!editName ? <button onClick={() => setEditName(true)}><MdEdit/></button> : 
          <>
            <button onClick={() => handleConfirmEdit('name')}><FaCheck/></button>
            <button onClick={() => setEditName(false)}><MdOutlineCancel/></button>
          </>          
          }
        </div>
      </div>
      <div className="info_box">
        <div className="info_title">Miasto:</div>
        <div className="info_content">
        {editCity ? <input className="edit_input" onChange={(e) => setCityValue(e.target.value)} value={cityValue}></input> : <span>{city}</span>}
        </div>
        <div className="edit_btn">
          {!editCity ? <button onClick={() => setEditCity(true)}><MdEdit/></button> : 
          <>
          <button onClick={() => handleConfirmEdit('city')}><FaCheck/></button>
          <button onClick={() => setEditCity(false)}><MdOutlineCancel/></button>
          </>
          
          }
        </div>
      </div>
      <div className="info_box">
        <div className="info_title">Ulubiony gatunek</div>
        <div className="info_content">
          {editGenre ? <input className="edit_input" onChange={(e) => setGenreValue(e.target.value)} value={genreValue}></input> : <span>{favGenre}</span>}
        </div>    
        <div className="edit_btn">
          {!editGenre ? <button onClick={() => setEditGenre(true)}><MdEdit/></button> : 
          <>
          <button onClick={() => handleConfirmEdit('genre')}><FaCheck/></button>
          <button onClick={() => setEditGenre(false)}><MdOutlineCancel/></button>
          </>
          }
        </div>
      </div>
      <div className="info_box">
        <div className="info_title">Instrument: </div>
        <div className="info_content">
         {editInstrument ? <input className="edit_input" onChange={(e) => setInstrumentValue(e.target.value)} value={instrumentValue}></input> : <span>{instrument}</span>}
        </div>
        <div className="edit_btn">
          {!editInstrument ? <button onClick={() => setEditInstrument(true)}><MdEdit/></button> : 
          <>
          <button onClick={() => handleConfirmEdit('instrument')}><FaCheck/></button>
          <button onClick={() => setEditInstrument(false)}><MdOutlineCancel/></button>
          </>
          }
        </div>
      </div>
      <div className="info_box">
        <div className="info_title">Informacje: </div>
        <div className="info_content">
        {editInfo ? <input className="edit_input" onChange={(e) => setInfoValue(e.target.value)} value={infoValue}></input> : <span>{info}</span>}
        </div>
        <div className="edit_btn">
          {!editInfo ? <button onClick={() => setEditInfo(true)}><MdEdit/></button> : 
          <>
            <button onClick={() => handleConfirmEdit('info')}><FaCheck/></button>
            <button onClick={() => setEditInfo(false)}><MdOutlineCancel/></button>
          </>
          }
        </div>

      </div>
      </div> 
      <UserSettings/>  
    </div>
  );
}


function UserSettings(){
  //state for form management
  const [editEmail, setEditEmail] = useState(false)
  const [emailValue, setEmailValue] = useState('')

  const [editPassword, setEditPassword] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')
  const [passwordInputType, setPasswordInputType] = useState('password')
  const [passwordVisible, setPasswordVisible] = useState(false)

  //state for token 
  const [token, setToken] = useState()

  //state for user data
  const [email, setEmail] = useState('Brak danych')
  const [password, setPassword] = useState('Brak danych')

  useEffect(() => {
    if (typeof window !== 'undefined'){
      setToken(sessionStorage.getItem('token'))
    }
  }, [])

  const getUserInfo = async () => {
    const response = fetch('http://localhost:4000/api/user/info', {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      credentials: "include"
    }).then(res => res.json())
    .then(res => {
      saveUserInfo(res)
    }).catch(e => {
      alert("Nie udało się załadować danych")
    })
  }

  const saveUserInfo = ({userData}) => {
    setEmail(userData.email)
    setPassword(userData.password)
  }


  useEffect(() => {
    if(token){
      getUserInfo()
    }
  }, [token])

  const clearInuput = (inputName) => {
    if (inputName === 'email') return setEmailValue('')
    else if (inputName === 'password') return setPasswordValue('')
  }

  const setNewContent = (endpoint, newContent) => {
    if (endpoint === 'email') return setEmail(newContent)
    else if(endpoint === 'password') return setPassword(newContent)
  }

  
  const sendEditReqest = async (endpoint, key, value) => {
    const bodyObj = {
      [key]: value
    }
    const request = fetch(`http://localhost:4000/api/user/${endpoint}`, {
      method: "PUT",
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: "include",
      body:JSON.stringify(bodyObj)
    }).then(res => {
      if(res.ok) return res.json()
    }).then(res => {
      setNewContent(endpoint, res.newContent)
    })
      .catch(e => alert("Wystąpił błąd poczas edytowania"))
      .finally(() => {
        //clear input
        clearInuput(endpoint)
      })
  }

  const verifyEmail = email => email.includes('@') && !email.includes(' ') && email.length > 0
  const verifyPassword = password => password.length > 0
  const handleConfirmEdit = (edit) => {
    if(edit==='email'){
      if(!verifyEmail(emailValue)) return alert("Proszę podać poprawną wartość")
      setEditEmail(false)
      sendEditReqest('email', 'newEmail', emailValue)
    }else if(edit==='password'){
      if(!verifyPassword(passwordValue)) return alert("Proszę podać poprawne hasło")
      setEditPassword(false)
      sendEditReqest('password', 'newPassword', passwordValue)
    }
  }

  const changeInputType = () => {
    const newType = passwordInputType === 'password' ? 'text' : 'password'
    setPasswordInputType(newType)
  }

  const getPassword = () => passwordVisible ? password : "*".repeat(password.length)
  return(
    <>
    <div className="user_info">
      <h3>Ustawienia konta</h3>
      <div className="info_box">
        <div className="info_title">Email: </div>
        <div className="info_content">
        {editEmail ? <input className="edit_input" onChange={(e) => setEmailValue(e.target.value)} value={emailValue}></input> : <span>{email}</span>}
        </div>
        <div className="edit_btn">
          {!editEmail ? <button onClick={() => setEditEmail(true)}><MdEdit/></button> : 
          <>
            <button onClick={() => handleConfirmEdit('email')}><FaCheck/></button>
            <button onClick={() => setEditEmail(false)}><MdOutlineCancel/></button>
          </>
          }
        </div>
      </div>
      <div className="info_box">
        <div className="info_title">Hasło: </div>
        <div className="info_content">
        {editPassword ? <input type={passwordInputType} className="edit_input" onChange={(e) => setPasswordValue(e.target.value)} value={passwordValue}></input> : <span>{getPassword()}</span>}
        </div>
        <div className="edit_btn">
          {!editPassword ? <>
            <button onClick={() => setEditPassword(true)}><MdEdit/></button>
            <button onClick={() => setPasswordVisible(!passwordVisible)}>{passwordVisible ? <BiHide/> : <BiShow/>}</button>
          </> : 
          <>
            <button onClick={() => handleConfirmEdit('password')}><FaCheck/></button>
            <button onClick={() => setEditPassword(false)}><MdOutlineCancel/></button>
            <button onClick={() => changeInputType()}>{passwordInputType === 'text' ? <BiHide/> : <BiShow/>}</button>
          </>
          }
        </div>
      </div>
    </div>
    <DeleteAccount/>
    </>
  )
}