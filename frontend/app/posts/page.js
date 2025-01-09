"use client"
import Post from "../components/Post";
import { useEffect, useState } from "react";
import "../style/posts.css"

// import mqtt from "mqtt"

export default function Posts() {
  const [posts, setPosts] = useState([])
  const [userPosts, setUserPosts] = useState([])
  const [token, setToken] = useState()
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostContent, setNewPostContent] = useState('')


  const getPosts = async () => {
    const response = await fetch('http://localhost:4000/api/posts').then(res => res.json())
    setPosts(response.posts)
  }
  const getUserPosts = async () => {

    const userPostsResponse = await fetch('http://localhost:4000/api/user/posts', {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: "include",
    }).then(res => res.json())
    .then(res => setUserPosts(res.posts))
  }
  //console.log(posts);

  useEffect(() => {
    if (typeof window !== 'undefined'){
      setToken(sessionStorage.getItem('token'))
    }

    // console.log(mqtt)
    // const client = mqtt.connect("ws://localhost:8000/mqtt")

    // client.on('connect', () => {
    //   console.log('connected to broker')
    //   client.subscribe('post/add')
    // })
    // client.on('error', (err) => {
    //   console.log('Error: ', err);
    // })
    // client.on('message', (topic, message) => {
    //   console.log("dodano post");
    // })
    // return () => {
    //   client.end()
    // }
  }, [])
  useEffect(() => {
    if (token){

      getPosts()
      getUserPosts()
    }
  }, [token])

  const handleAddPost = async () => {
    const request = await fetch('http://localhost:4000/api/post/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: "include",
      body: JSON.stringify({
        title: newPostTitle,
        content: newPostContent
      })
    }).then(res => {
      if(res.ok){
        alert("Dodano post")
        getUserPosts()
      }
    }).catch(e => {
      alert("Nie udało się dodać posta")
    }).finally(() => {
      //clear inputs
      setNewPostContent('')
      setNewPostTitle('')
    })
  }

  // const posts = getPosts()
  // const userPosts = getUserPosts()
  //console.log(userPosts);
  return (
    <div>
    <div className="add_post">
      <input type="text" id="add_post_title" placeholder="Tytuł posta" value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)}></input>
      <textarea type="text" id="add_post_contet" placeholder="Napisz cos..." value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)}></textarea>
      <button id="add_post_button" onClick={() => handleAddPost()}>Opublikuj</button>
    </div>
    <h1>Posty użytkowników</h1>
    <div className="posts_container">
     {posts.map(post => (
      <Post key={post.id} 
      // title={post.title}
      // createDate={post.createDate}
      // modifyDate={post.modifyDate}
      // content={post.content}
      {...post}
      userPosts={userPosts}
      />
     ))}
     </div>
    </div>
  );
}