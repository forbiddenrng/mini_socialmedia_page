"use client"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"

import "../style/vote.css"
import { ResponsiveContainer, Tooltip, PieChart, Pie } from "recharts"

export default function VotePage(){

  const [socket, setSocket] = useState(null)
  const [voteResults, setVoteResuls] = useState([])

  const [selectedOption, setSelectedOption] = useState('')
  const [token, setToken] = useState()

  const castVote = () => {
    if(selectedOption !== ''){
      socket.emit('castVote', {token, vote: selectedOption})
      setSelectedOption('')
    }
  }


  useEffect(() => {
    setToken(sessionStorage.getItem('token'))
    const newSocket = io('http://localhost:5000')
    setSocket(newSocket)

    newSocket.emit('getVotingResults')

    newSocket.on('receiveVotingResults', ({votingResults}) => {
      //console.log("Received voting results");
      setVoteResuls(votingResults)
    })
    newSocket.on("voteError", ({message}) => {
      alert(message)
    })
    return () => {
      newSocket.disconnect()
    }
  }, [])

  return(
    <div>
      <h1 className="vote_header">Głosuj na artystę dnia</h1>
      <div className="voting_results">
        {/* <VoteResults votes={voteResults}/> */}
        <h3>Wyniki głosowania</h3>
        <ResponsiveContainer width="100%" minHeight={300}>
          <PieChart>
            <Tooltip
              formatter={value => `${value} głosów`}
            />
            <Pie data={voteResults} 
            dataKey="totalVotes" 
            label={artist => artist.artistName} 
            nameKey="artistName" 
            fill="var(--nav-background)"/>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="voting_form_wrapper">
      <div className="voting_form">
        {voteResults.map((artist, i) => (
          <label key={i}>
          <input
            type="radio"
            name="singleChoice"
            value={artist.artistID}
            checked={selectedOption === artist.artistID}
            onChange={() => setSelectedOption(artist.artistID)}
          />
          {artist.artistName}
          </label>
        ))}
      </div>
      <button className="voting_button" onClick={() => castVote()}>Głosuj</button>
      </div>
    </div>
  )
}

function VoteResults({votes}){
  return (
    <div className="voting_results">
      {votes.map(artist => <p key={artist.artistID}>{artist.artistName} : {artist.totalVotes}</p>)}
    </div>
  )
}