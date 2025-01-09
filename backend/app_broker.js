const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883')
const fs = require('fs');

const getDate = () => {
  const now = new Date()
  const day = now.toISOString().slice(0,10)
  const time = now.toISOString().slice(11,19)
  return `${day} ${time}`
}

const topic = [
  'post/add', 'post/edit', 'post/delete',
  'user/edit/name', 'user/edit/city', 'user/edit/genre', 'user/edit/instrument', 'user/edit/info',
  'user/edit/email', 'user/edit/password'
]

const logToFile = (message) => {
  fs.appendFile('log.txt', `message\n`, (err) => {
    if (err){
      console.log("Błąd podczas zapisywania logów");
    }
  })
}

client.on('connect', () => {
  console.log("Client connected to broker");
  client.subscribe(topic)
})

client.on('message', (topic, message) => {
  if(topic === 'post/add'){
    const {ownerId, id} = JSON.parse(message)
    //console.log("Broker message: add post");
    const date = getDate()
    //console.log(`[POST ADD] [${date}]: Użytkownik ${ownerId} utworzył post ${id}`);
    logToFile(`[POST ADD] [${date}]: Użytkownik ${ownerId} utworzył post ${id}`);
  }
  else if(topic === 'post/edit'){
    const {ownerId, id} = JSON.parse(message)
    const date = getDate()
    // console.log(`[POST EDIT] [${date}]: Użytkownik ${ownerId} zmodyfikował post ${id}`);
    logToFile(`[POST EDIT] [${date}]: Użytkownik ${ownerId} zmodyfikował post ${id}`)
  }
  else if(topic === 'post/delete'){
    const {ownerId, id} = JSON.parse(message)
    const date = getDate()
    // console.log(`[POST DELETE] [${date}]: Użytkownik ${ownerId} usunął post ${id}`);
    logToFile(`[POST EDIT] [${date}]: Użytkownik ${ownerId} zmodyfikował post ${id}`)
  } else if(topic === 'user/edit/name'){
    const {userID, newUsername} = JSON.parse(message)
    const date = getDate()
    logToFile(`[USER EDIT] [${date}]: Użytkownik ${userID} zmienił nazwę na ${newUsername}`)
  }
  else if(topic === 'user/edit/city'){
    const {userID, newCity} = JSON.parse(message)
    const date = getDate()
    logToFile(`[USER EDIT] [${date}]: Użytkownik ${userID} zmienił miasto na ${newCity}`)
  }
  else if(topic === 'user/edit/genre'){
    const {userID, newGenre} = JSON.parse(message)
    const date = getDate()
    logToFile(`[USER EDIT] [${date}]: Użytkownik ${userID} zmienił ulubiony gatunek na ${newGenre}`)
  }
  else if(topic === 'user/edit/instrument'){
    const {userID, newInstrument} = JSON.parse(message)
    const date = getDate()
    logToFile(`[USER EDIT] [${date}]: Użytkownik ${userID} zmienił instrument na ${newInstrument}`)
  }
  else if(topic === 'user/edit/info'){
    const {userID} = JSON.parse(message)
    const date = getDate()
    logToFile(`[USER EDIT] [${date}]: Użytkownik ${userID} zaktualizował swoje informacje`)
  }
  else if(topic === 'user/edit/email'){
    const {userID, newEmail} = JSON.parse(message)
    const date = getDate()
    logToFile(`[USER EDIT] [${date}]: Użytkownik ${userID} zmienił maila na ${newEmail}`)
  }
  else if(topic === 'user/edit/password'){
    const {userID} = JSON.parse(message)
    const date = getDate()
    logToFile(`[USER EDIT] [${date}]: Użytkownik ${userID} zmienił hasło`)
  }
})