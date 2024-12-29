"use client"
import Post from "../components/Post";
import { useEffect, useState } from "react";
export default function Posts() {
  const token = sessionStorage.getItem('token')
  const [posts, setPosts] = useState([])
  const [userPosts, setUserPosts] = useState([])
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
    getPosts()
    getUserPosts()
  }, [])
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
      />
     ))}
     </div>
    </div>
  );
}