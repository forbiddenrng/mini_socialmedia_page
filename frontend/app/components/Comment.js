"use client"
import { useEffect, useState } from "react";
import { MdEdit, MdDelete, MdCancel } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

export default function Comment({_id, ownerId, content, ownerName, userComments}) {
  const userCommentsIds = userComments.map(comment => comment.ownerId)
  const [editMode, setEditMode] = useState(false)
  const [newCommentValue, setNewCommentValue] = useState("")
  const [token, setToken] = useState(null)
  useEffect(() => {
    setToken(sessionStorage.getItem('token'))
  })
  const handleDeleteComment = async () => {
    const request = fetch('http://localhost:4000/api/comments/delete', {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: "include",
      body: JSON.stringify({
        commentId: _id
      })
    }).then(res => {
      alert("Usunięto komentarz")
    })
  }

  const handleEditComment = async () => {
    const request = fetch('http://localhost:4000/api/comments/edit', {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: "include",
      body: JSON.stringify({
        commentId: _id,
        newContent: newCommentValue
      })
    }).then(res => {
      if(res.ok){
        setNewCommentValue("")
        setEditMode(false)
      }
    })
  }

  return (
    <div className="comment">
      <div className="comment_author">{ownerName}</div>
      <div className="comment_content">{content}</div>
      {userCommentsIds.includes(ownerId) && (
        <div className="comment_buttons">
          <button onClick={() => setEditMode(true)}><MdEdit /></button>
          <button onClick={handleDeleteComment}><MdDelete/></button>
        </div>
      )}
      {editMode && (<div className="comment_edit">
        <input value={newCommentValue} onChange={(e) => setNewCommentValue(e.target.value)}></input>
        <button onClick={() => handleEditComment()}><FaCheck/></button>
        <button onClick={() => setEditMode(false)}><MdCancel/></button>
      </div>)}
    </div>
  )
};
