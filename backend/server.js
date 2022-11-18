const express = require('express')
const server = express()
const cors = require('cors')
const port = 8080
const db = require('./database')

server.use(cors())
server.use(express.json({extended: false}))


server.post('/api/login', async(req, res) => {
    const name = req.body.params.name
    const pass = req.body.params.password
    
    let response = {}

    try {
        const r = await db.query(`
            SELECT password FROM users
            WHERE name = $1 
        `, [name])
        if ( r.rowCount == 0 ) {
            response.login = false
            response.message = 'Username not found'
            res.status(404).send(JSON.stringify(response)).end()
        } else {
            if (r.rows[0].password.localeCompare(pass) == 0) {
                response.login = true
                response.message = 'OK'
                res.status(200).send(JSON.stringify(response)).end()
            } else {
                response.login = false
                response.message = 'Incorrect password'
                res.status(400).send(JSON.stringify(response)).end()
            }           

        }
    } catch(e) {
        response.message = 'Server error'
        response.error = e
        console.log(e)
        res.status(500).send(JSON.stringify(response)).end()
    }
})


server.post('/api/register', async (req, res) => {
    const name = req.body.params.name
    const pass = req.body.params.password

    let response = {}

    try {
        const r = await db.query(`
        insert into users (name, password) 
        values ($1, $2)
        `, [name, pass])
        response.register = true
        response.serverError = false
        response.message = 'Success'

        res.status(200).send(JSON.stringify(response)).end()
    } catch(e) {
        console.log(e)
        if ( e.constraint === 'users_name_key' ) {
            response.register = false
            response.serverError = false
            response.message = 'Username already exists'
            res.status(400).send(JSON.stringify(response)).end()
        } else {
            response.register = false
            response.serverError = true
            response.message = e
            res.status(500).send(JSON.stringify(response)).end()
        }
        
    }
})



server.get('/api/admin/init', async (req, res) => {
    let response = {}
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await sleep(1000)

    try {
        const r = await db.query(`
            SELECT id, name
            FROM users
            WHERE id > 1
        `)

        response.usersData = JSON.stringify(r.rows)
        response.serverError = false
        response.message = 'Success'
        res.status(200).send(JSON.stringify(response)).end()
    } catch (e) {
        console.log(e)
        response.serverError = true
        response.message = e
        res.status(500).send(JSON.stringify(response)).end()
    }
})




server.listen(port, ()=> console.log('Im running biatch'))