const express = require('express')
const server = express()
const cors = require('cors')
const port = 8080

server.use(cors())
server.use(express.json({extended: false}))


server.post('/login', async(req, res) => {
    const name = req.body.name.toString()
    const pass = req.body.pass.toString()

    const sleep = ms => new Promise(r => setTimeout(r, ms))
    await sleep(1000)

    console.log(name + '\n' + pass)

    res.status(200).send('kokotko').end()
})






server.listen(port, ()=> console.log('Im running biatch'))