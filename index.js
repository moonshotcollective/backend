const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const cors = require('cors')
// const fs = require('fs')

global.io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

const routes = require('./routes')

const port = process.env.PORT || 45622

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', function (req, res) {
  console.log('/')
  res.status(200).send('Hello App')
})

app.use('/signUpForTokens', routes.signUpForTokens)

var appServer = server.listen(port, function () {
  console.log('HTTP Listening on port:', appServer.address().port)
})
