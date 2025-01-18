"use client"
import { MdDelete } from "react-icons/md";
import "../style/profile.css"
import { useEffect, useState } from "react";
export default function DeleteAccount(){

  const [token, setToken] = useState()

  const handleDeleteAccount = async () => {
    const request = await fetch('http://localhost:4000/api/user/delete', {
      method: "DELETE",
      headers:{
        'Authorization': `Bearer ${token}`
      },
      credentials: "include"
    })
  }
  useEffect(()=> {
    setToken(sessionStorage.getItem("token"))
  })
  return (
    <div className="delete_account">
      <button onClick={handleDeleteAccount}><MdDelete/> Usuń konto</button>
    </div>
  )
}