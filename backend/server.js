const express = require('express')
const server = express()
const cors = require('cors')
const port = 8080
const db = require('./database')
const { application } = require('express')

server.use(cors())
server.use(express.json({extended: false}))


var activeSessions = []


server.post('/api/login', async(req, res) => {
    const name = req.body.params.name
    const pass = req.body.params.password
    
    let response = {}

    try {
        const r = await db.query(`
            SELECT id, password, age FROM users
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
                response.userID = r.rows[0].id
                response.userAge = r.rows[0].age
                if ( activeSessions.length === 0 ) 
                    response.sessionID = 0
                else
                    response.sessionID = activeSessions[activeSessions.length - 1].sessionID + 1
                res.status(200).send(JSON.stringify(response)).end()
                activeSessions.push({
                    sessionID: response.sessionID,
                    userID: r.rows[0].id
                })
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

server.delete('/api/logout', (req, res) => {
    const sessionID = req.body.sessionID
    const response = {}

    if ( activeSessions.find( e => {return e.sessionID === sessionID}) == undefined) {
        response.message = `Can't logout. Session doesn't exist`
        response.serverError = true
        response.logout = false
        res.status(500).send(JSON.stringify(response)).end()
    } else {
        activeSessions = activeSessions.filter( e => {
            return e.sessionID != sessionID
        })
        response.message = `Success`
        response.serverError = false
        response.logout = true
        res.status(200).send(JSON.stringify(response)).end()
    }
})

server.post('/api/register', async (req, res) => {
    const name = req.body.params.name
    const pass = req.body.params.password
    const email = req.body.params.email

    let response = {}

    try {
        const r = await db.query(`
        insert into users (name, password, email) 
        values ($1, $2, $3)
        returning id        
        `, [name, pass, email])
        response.register = true
        response.serverError = false
        response.message = 'Success'
        response.userID = r.rows[0].id
        if ( activeSessions.length === 0 ) 
            response.sessionID = 0
        else 
            response.sessionID = activeSessions[activeSessions.length - 1].sessionID + 1
        res.status(200).send(JSON.stringify(response)).end()
        activeSessions.push({
            sessionID: response.sessionID,
            userID: r.rows[0].id
        })
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
            response.message = 'Server error'
            response.error = e
            res.status(500).send(JSON.stringify(response)).end()
        }
        
    }
})

server.post('/api/register/finish', async(req, res) => {
    const age = req.body.params.age
    const height = req.body.params.height
    const weight = req.body.params.weight
    const id = req.body.params.id

    const response = {}

    try {
        const r = await db.query(`
            UPDATE users
            SET 
                age = $1,
                height = $2,
                weight = $3
            WHERE id = $4
        `, [age, height, weight, id])

        response.message = 'OK'
        response.finish = true

        res.status(200).send(JSON.stringify(response)).end()

    } catch ( e ) {
        console.log(e)
        response.message = 'Server error'
        response.finish = false
        res.status(500).send(JSON.stringify(response)).end()
    }
})



server.get('/api/admin/init', async (req, res) => {
    let response = {}

    //A sak ved... preco nie?
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await sleep(1000)

    try {
        const r = await db.query(`
            SELECT id, name, email, age, height, weight
            FROM users
            WHERE id > 1
            ORDER BY name
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

server.delete('/api/admin/delete/:id', async (req, res) => {
    const { id } = req.params


    try {
        const r = await db.query(`
            DELETE
            FROM users 
            WHERE id = ${id}
        `)


    } catch(e) {
        console.log(e)
    }
})

server.get('/api/admin/export', async (req, res) => {
    try{ 
        const r = await db.query(`
        SELECT name, password, email, age, height, weight
        FROM users
        WHERE id > 1
        `)

    var csvData = ''
    const users = []

    r.rows.forEach(r => {
        users.push([r.name, r.password, r.email, r.age, r.height, r.weight])
    })

    users.forEach( (e, index) => {
        let arrToString = e.join(';');
        csvData += (index < users.length - 1) ? arrToString + '\n' : arrToString;
      })

    res.setHeader('Content-Disposition', `attachment; filename="users.csv"`)
    res.setHeader('Content-Type', 'application/octet-stream; charset=utf-8')
    res.setHeader('Content-Length', csvData.length)
    res.status(200).send(csvData).end()
    } catch (e) {
        console.log(e)
        res.status(500).end()
    }
})




server.listen(port, ()=> console.log('Im running biatch'))