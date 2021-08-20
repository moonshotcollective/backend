const express = require('express')
const fs = require('fs')
const https = require('https')
const cors = require('cors')
const app = express()
const routes = require('./routes')

let currentMessage = 'I am **ADDRESS** and I would like to sign in to YourDapp, plz!'

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', function (req, res) {
  console.log('/')
  res.status(200).send(currentMessage)
})

app.use('/signUpForTokens', routes.signUpForTokens)

if (fs.existsSync('server.key') && fs.existsSync('server.cert')) {
  https
    .createServer(
      {
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert'),
      },
      app
    )
    .listen(45622, () => {
      console.log('HTTPS Listening: 45622')
    })
} else {
  var server = app.listen(45622, function () {
    console.log('HTTP Listening on port:', server.address().port)
  })
}
