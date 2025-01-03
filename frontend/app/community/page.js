"use client"
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

import "../style/community.css"

export default function Community() {
  const [inputValue, setInputValue] = useState('')
  const [usersInfo, setUsersInfo] = useState([])
  const [errorGettingUsers, setErrorGettingUsers] = useState(false)

  const getUsersInfo = async () => {
    const response = await fetch(`http://localhost:4000/api/users/info?expression=${inputValue}`, {
      method: 'GET'
    }).then(res => {
      if(res.ok) {
        setErrorGettingUsers(false)
        return res.json()
      }
    }).then(res => setUsersInfo(res.usersInfo))
    .catch(error => setErrorGettingUsers(true))
    .finally(() => setInputValue(''))
  }


  return (
    <div>
    <h1 className="community_header">Wyszukaj innych użytkowników</h1>
      <div className="search_form">
      <input type="text" placeholder="Wyszukaj użytkownika" value={inputValue} onChange={(e) => setInputValue(e.target.value)}></input>
      <button className="search_button" onClick={() => getUsersInfo()}><FaSearch/></button>
     </div>
     <div className="users_info">
      {errorGettingUsers ? <p className="users_not_found">Nie znaleziono użytkowników</p> : usersInfo.map(user => <UserInfo key={user.id} {...user}/>)}
     </div>
     
    </div>
  );
}

function UserInfo({name, city, favGenre, instrument, info}){
  return (
    <div className="user">
      <p className="user_field">
        <span className="label">Nazwa użytkownika:</span> {name}
      </p>
      <p className="user_field">
        <span className="label">Miasto:</span> {city}
      </p>
      <p className="user_field">
        <span className="label">Ulubiony gatunek:</span> {favGenre}
      </p>
      <p className="user_field">
        <span className="label">Instrument:</span> {instrument}
      </p>
      <p>{info}</p>
    </div>
  )
}