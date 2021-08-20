const express = require('express')
const fs = require('fs')
const https = require('https')
const cors = require('cors')
const app = express()
const routes = require('./routes')

let currentMessage = 'I am **ADDRESS** and I would like to sign in to YourDapp, plz!'

const port = process.env.PORT || 45622

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
    .listen(port, () => {
      console.log('HTTPS Listening: ' + port)
    })
} else {
  var server = app.listen(port, function () {
    console.log('HTTP Listening on port:', server.address().port)
  })
}
