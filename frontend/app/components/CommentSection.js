"use client"
import { IoSend } from "react-icons/io5";
import "../style/comments.css"
import { useEffect, useState } from "react";
import Comment from "./Comment";
export default function CommentSection({id}){
  const [newComment, setNewComment] = useState("")
  const [token, setToken] = useState(null)
  const [comments, setComments] = useState([])
  const [userComments, setUserComments] = useState([])

  useEffect(() => {
    setToken(sessionStorage.getItem('token'))
  })

  useEffect(() => {
    if(token){
      getComments()
      getUserComments()
    }
  }, [token])

  const addComment = async () => {
    if(newComment === "") return alert("Komentarz nie może być pusty")
    const request = await fetch("http://localhost:4000/api/comments/add", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: "include",
      body: JSON.stringify({
        postId: id,
        content: newComment
      })
    }).then(res => res.json())
    .then(res => console.log(res))
  }

  const getComments = async () => {
    const request = await fetch(`http://localhost:4000/api/comments/${id}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: "include"
    }).then(res => res.json())
    .then(data => {
      console.log(data.comments);
      setComments(data.comments.map(obj => ({...obj._doc, ownerName: obj.ownerName})))
    })
  }
  const getUserComments = async () => {
    const request = await fetch(`http://localhost:4000/api/comments/${id}/user`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: "include"
    }).then(res => res.json())
    .then(data => {
      setUserComments(data.userComments)
    })
  }
  
  useEffect(() => {
    console.log(comments);
  }, [comments])
  return (
    <div className="comment_section">
      <div className="comments_container">
        {comments.map(comment => (
          <Comment key={comment._id} {...comment} userComments={userComments}/>
        ))}
      </div>
      <div className="comment_form">
        <input value={newComment} onChange={(e) => setNewComment(e.target.value)} className="add_comment" placeholder="Napisz komentarz..."></input>
        <button onClick={() => addComment()}><IoSend/></button>
      </div>
    </div>
  )
}