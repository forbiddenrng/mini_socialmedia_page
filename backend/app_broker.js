const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883')

const getDate = () => {
  const now = new Date()
  const day = now.toISOString().slice(0,10)
  const time = now.toISOString().slice(11,19)
  return `${day} ${time}`
}

client.on('connect', () => {
  console.log("Client connected to broker");
  client.subscribe(['post/add', 'post/edit', 'post/delete'])
})

client.on('message', (topic, message) => {
  if(topic === 'post/add'){
    const {ownerId, id} = JSON.parse(message)
    //console.log("Broker message: add post");
    const date = getDate()
    console.log(`[POST ADD] [${date}]: Użytkownik ${ownerId} utworzył post ${id}`);
  }
  else if(topic === 'post/edit'){
    const {ownerId, id} = JSON.parse(message)
    const date = getDate()
    console.log(`[POST EDIT] [${date}]: Użytkownik ${ownerId} zmodyfikował post ${id}`);
  }
  else if(topic === 'post/delete'){
    const {ownerId, id} = JSON.parse(message)
    const date = getDate()
    console.log(`[POST DELETE] [${date}]: Użytkownik ${ownerId} usunął post ${id}`);
  }
})