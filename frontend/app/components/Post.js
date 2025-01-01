"use client"

import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

export default function Post({title, createDate, modifyDate, content, ownerId, userPosts, id}){
  const [editMode, setEditMode] = useState(false)
  const [token, setToken] = useState()
  //onst router = useRouter()
  useEffect(() => {
    if (typeof window !== 'undefined'){
      setToken(sessionStorage.getItem('token'))
    }
  }, [])
  const handleDeletePost = async () => {
    const request = await fetch('http://localhost:4000/api/post/delete', {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: "include",
      body: JSON.stringify({
        postId: id,
      })
    }).then(res => {
      if(res.ok){
        alert("Pomyślnie usunięto post")
      }
    }).catch(e => {
      alert("Nie udało się usunąć posta")
    })
  }

  const handleEditPost = () => {
    setEditMode(true)
  }

  return(
    <div className="post">
      <h3>{title}</h3>
      <span>Post użytkownika: {ownerId}</span>
      {modifyDate === null ? <span>{createDate}</span> : <span>Edytowano {modifyDate}</span>}
      <p>{content}</p>
      {userPosts.includes(ownerId) && <button onClick={() => handleDeletePost()}><MdDelete/></button>}
      {userPosts.includes(ownerId) && <button onClick={() => handleEditPost()}><MdEdit/></button>}
      {editMode && <EditPost title={title} content={content} changeEditMode={setEditMode} id={id}/>}
    </div>
  )
}

function EditPost({title, content, changeEditMode, id}){
  const [newTitle, setNewTitle] = useState(title)
  const [newContent, setNewContent] = useState(content)
  const [token, setToken] = useState()

  useEffect(() => {
    if (typeof window !== 'undefined'){
      setToken(sessionStorage.getItem('token'))
    }
  }, [])

  //const token = sessionStorage.getItem('token')
  const handleSaveEdit = async () => {
    //request here
    const request = await fetch('http://localhost:4000/api/post/edit', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: "include",
      body: JSON.stringify({
        postId: id,
        newContent,
        newTitle
      })
    }).then(res => {
      if(res.ok){
        alert("Pomyślnie zmodyfikowano")
        changeEditMode(false)
      }
    }).catch(e => {
      alert("Nie udało się zmodyfikować zawartości posta")
    })
  }
  return (
    <div className="edit_post">
      <input type="text" value={newTitle} onChange={(e) =>setNewTitle(e.target.value)}></input>
      <textarea type="text" value={newContent} onChange={(e) =>setNewContent(e.target.value)}></textarea>
      <button onClick={() => handleSaveEdit()}>Zapisz zmiany</button>
    </div>
  )
}