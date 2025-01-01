"use client"
import "../style/profile.css"

import { MdEdit } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { useState } from "react";


export default function Profile() {
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

  const handleConfirmEdit = (edit) => {
    if(edit === 'name'){
      setEditName(false)
    }else if(edit==='city'){
      setEditCity(false)
    }else if(edit==='genre'){
      setEditGenre(false)
    } else if(edit==='instrument'){
      setEditInstrument(false)
    } else if(edit==='info'){
      setEditInfo(false)
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
          {editName ? <input className="edit_input" onChange={(e) => setNameValue(e.target.value)} value={nameValue}></input> : <span>Nazwa użytkownika</span>}
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
        {editCity ? <input className="edit_input" onChange={(e) => setCityValue(e.target.value)} value={cityValue}></input> : <span>Miasto użytkownika</span>}
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
          {editGenre ? <input className="edit_input" onChange={(e) => setGenreValue(e.target.value)} value={genreValue}></input> : <span>Gatunek użytkownika</span>}
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
         {editInstrument ? <input className="edit_input" onChange={(e) => setInstrumentValue(e.target.value)} value={instrumentValue}></input> : <span>Instument użytkownika</span>}
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
        {editInfo ? <input className="edit_input" onChange={(e) => setInfoValue(e.target.value)} value={infoValue}></input> : <span>Informacje użytkownika</span>}
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
    </div>
  );
}