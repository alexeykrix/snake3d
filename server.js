console.clear()

const port = 9000
const ws = require('ws')
const s = new ws.Server({port})
console.log(`✅ http://192.168.0.107:${port}`)
const clients = []

const sendUpdated = except => clients.forEach(
  client => {
    if (client.id !== except.id) {
      client.pipe.send(JSON.stringify({
        id: except.id,
        data: except.data
      }))
    }
})


const updateData = data => {
  clients.map(client => client.id === data.id ? client.data = data.data : '')
  sendUpdated(data)
}

const onPong = data => {

}

const onMsg = msg => {
  const data = JSON.parse(msg)
  switch (data.action) {
    case 'UPDATE': updateData(data)
      break
    case 'PONG': onPong(data)
      break
    default: console.log('❓ Unknown command')
  }
}

const onClose = () => {
  console.log('➖')
}

const onConnect = wsClient => {
  const client = {
    id: +Date.now(),
  }
  console.log('➕ '+client.id)
  wsClient.send(JSON.stringify(client))
  client.pipe = wsClient
  clients.push(client)

  wsClient.on('message', onMsg)
  wsClient.on('close', onClose)
}




s.on('connection', onConnect)

//      На вашем аккаунте используются следующие IP-адреса
//      141.8.192.151общий, IP-адрес сервера vilir
//      2a0a:2b42:0:427::общий, IP-адрес сервера vilir
//      2a0a:2b43:a:658::персональный