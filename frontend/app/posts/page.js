"use client"
import Post from "../components/Post";
import { useEffect, useState } from "react";
export default function Posts() {
  const [posts, setPosts] = useState([])
  const [userPosts, setUserPosts] = useState([])
  const [token, setToken] = useState()


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
  }, [])
  useEffect(() => {
    if (token){

      getPosts()
      getUserPosts()
    }
  }, [token])
  // const posts = getPosts()
  // const userPosts = getUserPosts()
  //console.log(userPosts);
  return (
    <div className="posts_section">
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