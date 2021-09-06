const express = require('express')
const ethers = require('ethers')
const router = express.Router()

const cache = {}

function handleSignIn({ room, signature }) {
  // recover the signing address
  recovered = ethers.utils.verifyMessage(room, signature).toLowerCase()

  // make sure room exists
  if (!cache[room]) {
    cache[room] = []
  }

  // add user as a signed in account
  if (!cache[room].includes(recovered)) {
    cache[room].push(recovered)
  }

  // notify the room of a new sign in update
  io.to(room).emit('new-sign-in', cache[room])
}

io.on('connection', (socket) => {
  // get room and subscribe user to room events
  const { room } = socket.handshake.query

  // send existing room list to user
  io.to(socket.id).emit('list', cache[room] || [])

  // join room for updates
  socket.join(room)

  // listen for sign-in event
  socket.on('sign-in', handleSignIn)
})

router.get('/', function (req, res) {
  res.status(200).send(`Welcome to token drop sign up`)
})

// define the about route
router.post('/', async function (request, response) {
  const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress
  console.log('POST from ip address:', ip, request.body.message)
  console.log(request.body)

  let recovered = ethers.utils.verifyMessage(request.body.message, request.body.signature)
  if (recovered == request.body.address) {
    console.log('RECOVERED', recovered)

    recovered = recovered.toLowerCase()

    if (!cache[request.body.message]) {
      cache[request.body.message] = []
    }

    let signedIn = false

    if (!cache[request.body.message].includes(recovered)) {
      cache[request.body.message].push(recovered)
      signedIn = true
    }
    console.log(cache)
    response.send(signedIn)
  }
})

router.get('/:message', function (req, res) {
  console.log('/message', req.params)
  const message = req.params.message.toLowerCase()
  res.status(200).send(cache[message] || [])
})

module.exports = router
