"use client"

import { useState, useEffect } from "react"
import Charts from "../components/Charts"

import { io } from "socket.io-client"
export default function ChartsPage(){

  const [socket, setSocket] = useState(null)
  const [charts, setCharts] = useState([])

  useEffect(() => {
    const newSocket = io("http://localhost:5000")
    setSocket(newSocket)

    newSocket.on('updateCharts', ({charts}) => {
      //console.log('receive');
      setCharts(charts)
    })

    return () => {
      newSocket.disconnect()
    }
  }, [])

  useEffect(() => {
    if(socket){
      socket.emit('getCharts')
    }
  }, [socket])

  return (
    <div>
      {!charts.length ? <p>Loading charts</p> : <Charts charts={charts}/>}
    </div>
  )
}