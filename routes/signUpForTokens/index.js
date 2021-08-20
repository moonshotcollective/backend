const express = require('express')
const ethers = require('ethers')
const router = express.Router()

const cache = {}

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
