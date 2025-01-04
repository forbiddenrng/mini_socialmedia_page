"use client"
import { useRouter } from "next/navigation";

export default function Chat() {

  const chatData = [
    {id: 1, theme: "Temat pokoju 1"},
    {id: 2, theme: "Temat pokoju 2"},
    {id: 3, theme: "Temat pokoju 3"}
  ]
  return (
    <div>
     <h1 className="chat_header">Czatuj z innymi</h1>
     <div className="chat_select">
      {chatData.map(chat => <ChatSelect key={chat.id} {...chat}/>)}
     </div>
    </div>
  );
}

function ChatSelect({id, theme}){
  const router = useRouter()
  return(
    <div className="chat_info">
      <p>{theme}</p>
      <button onClick={() => router.push(`/chat/${id}`)}>Dołącz do czatu</button>
    </div>
  )
}