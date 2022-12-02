const express = require('express')
const server = express()
const cors = require('cors')
const port = 8080
const db = require('./database')
const bodyparser = require('body-parser')
const parse = require('csv-parse').parse
const multer = require('multer')
const os = require('os')
const upload = multer({ dest: os.tmpdir() })
const fs = require('fs')

server.use(cors())
server.use(express.json({extended: false}))
server.use(bodyparser.json())
//server.use(express.static('build'))

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
            if (r.rows[0].password.localeCompare(pass) === 0) {
                response.login = true
                response.message = 'OK'
                response.userID = r.rows[0].id
                response.age = r.rows[0].age
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
            INSERT INTO users (name, password, email) 
            VALUES ($1, $2, $3)
            RETURNING id        
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

server.get('/api/user/init/:id', async (req, res) =>{
    const response = {}
    const { id } = req.params
    try {
        const r = await db.query(`
            SELECT m.id, m.value, m.date,  m.method_id, COALESCE(me.name, 'Method name not set') AS name
            FROM weight AS m
            LEFT JOIN methods AS me ON m.method_id = me.id
            WHERE m.userid = $1
            ORDER BY date
        `, [id])

        const rr = await db.query(`
            SELECT m.id, m.value, m.date,  m.method_id, COALESCE(me.name, 'Method name not set') AS name
            FROM waist AS m
            LEFT JOIN methods AS me ON m.method_id = me.id
            WHERE m.userid = $1
            ORDER BY date
        `, [id])

        const rrr = await db.query(`
            SELECT m.id, m.value, m.date,  m.method_id, COALESCE(me.name, 'Method name not set') AS name
            FROM hips AS m
            LEFT JOIN methods AS me ON m.method_id = me.id
            WHERE m.userid = $1
            ORDER BY date
        `, [id])

        response.message = 'Success'
        r.rows.forEach(r => {
            r.type = 'Weight'
        })
        response.data = r.rows
        rr.rows.forEach(r => {
            r.type = 'Waist'
            response.data.push(r)
        })

        rrr.rows.forEach( r => {
            r.type = 'Hips'
            response.data.push(r)
        })
        
        res.status(200).send(JSON.stringify(response)).end()

    } catch (e) {
        console.log(e)
        response.message = 'Server error'
        response.error = e
        res.status(500).send(JSON.stringify(response)).end()
    }
})

server.get('/api/user/add/:id', async (req, res) => {
    const { id } = req.params
    const response = {}

    try {
        const r = await db.query(`
            SELECT image, link
            FROM add 
            WHERE id = $1
        `, [id])

        response.message = 'Success'
        response.data = r.rows[0]

        res.status(200).send(JSON.stringify(response)).end()
    } catch( e ) {
        console.log(e)

        response.message = 'Server error'
        response.error = e
        res.status(500).send(JSON.stringify(response)).end()
    }
 })


 server.put('/api/user/measurements', async(req, res) => {
    const userID = req.body.params.userID
    const value = req.body.params.value
    const date = req.body.params.date
    const method = req.body.params.method
    const type = req.body.params.type

    
    const response = {}

    try {
        const r = await db.query(`
            INSERT INTO ${type} (userID, value, date, method_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `, [userID, value, date, method])
        
        const rr = await db.query(`
            SELECT name
            FROM methods
            WHERE id = ${method}
        `)

        response.message = 'Success'
        response.measurementID = r.rows[0].id
        response.methodName = rr.rows[0].name
        res.status(200).send(JSON.stringify(response)).end()
    } catch (e) {
        console.log(e)
        response.message = 'Server error'
        response.error = e
        res.status(500).send(JSON.stringify(response)).end()
    }
 })
 
 server.delete('/api/user/measurement/:userID/:id/:type', async (req, res) => {
    const { userID } = req.params
    const { id } = req.params
    const { type } = req.params

    const response = {}

    try {
        const r = await db.query((`
            DELETE FROM ${type}
            WHERE id = $1 AND userID = $2
        `), [id, userID])

        response.message = 'Success'

        res.status(200).send(JSON.stringify(response)).end()
    } catch(e) {
        console.log(e)
        response.message = 'Server error'
        response.error = e
        res.status(500).send(JSON.stringify(response)).end()
    }
 })

 server.get('/api/user/export/:id', async (req, res) => {
    const { id } = req.params

    const response = {}

    try {
        const r = await db.query(`
            SELECT m.date, m.value, me.name
            FROM weight AS m
            LEFT JOIN methods AS me ON m.method_id = me.id
            WHERE userid = $1
            ORDER BY date
        `, [id])
        var csvData = ''
        const lines = []

        const rr = await db.query(`
            SELECT m.date, m.value, me.name
            FROM waist AS m
            LEFT JOIN methods AS me ON m.method_id = me.id
            WHERE userid = $1
            ORDER BY date
        `, [id])

        const rrr = await db.query(`
            SELECT m.date, m.value, me.name
            FROM hips AS m
            LEFT JOIN methods AS me ON m.method_id = me.id
            WHERE userid = $1
            ORDER BY date
        `, [id])

        r.rows.forEach(r => {
            lines.push([r.date, r.value, 'Weight', r.name])
        })

        rr.rows.forEach(r => {
            lines.push([r.date, r.value,  'Waist', r.name])
        })
        
        rrr.rows.forEach(r => {
            lines.push([r.date, r.value, 'Hips', r.name])
        })

        lines.forEach( (e, index) => {
            let arrToString = e.join(';');
            csvData += (index < lines.length - 1) ? arrToString + '\n' : arrToString;
        })

        res.setHeader('Content-Disposition', `attachment; filename="merania.csv"`)
        res.setHeader('Content-Type', 'application/octet-stream; charset=utf-8')
        res.setHeader('Content-Length', csvData.length)
        res.status(200).send(csvData).end()
    } catch(e) {
        console.log(e)
        res.status(500).end()
        
    }
 })

 server.get('/api/user/method/init', async (req, res) => {
    const response = {}

    try {
        const r = await db.query(`
            SELECT id, name, description
            FROM methods 
            ORDER BY id
        `)

        response.message = 'Success'
        response.data = r.rows

        res.status(200).send(JSON.stringify(response)).end()

    } catch (e) {
        console.log(e)
        res.status(500).end()
    }
 })

 server.put('/api/user/put/method', async(req, res) => {
    const response = {}
    const name = req.body.params.name
    const description = req.body.params.description
    const userID = req.body.params.userID

    try {
        const r = await db.query(`
            INSERT INTO methods(id, name, description)
            SELECT COALESCE(MAX(id), 0) + 1, $1, $2
            FROM methods
            RETURNING id
    `, [name, description])

        response.message = 'Success'
        response.id = r.rows[0].id

        res.status(200).send(JSON.stringify(response)).end()
    } catch(e) {
        console.log(e)

        res.status(500).end()

    }
 })

 server.delete('/api/user/delete/method/:id', async(req, res) => {
    const { id } = req.params

    const response = {}

    try {
        const r = await db.query(`
            DELETE 
            FROM methods
            WHERE id = $1
        `, [id])

        response.message = 'Success'

        res.status(200).send(JSON.stringify(response)).end()
    } catch(e) {
        console.log(e)

        res.status(500).end()
    }
 })


 server.post('/api/user/import/:userID', upload.single('file'), async (req, res) => {
    const response = {}
    const { userID } = req.params
    const file = req.file
    const data = fs.readFileSync(file.path)
    const weight = []
    const waist = []
    const hips = []
    response.data = []

    

    

    parse(data, (err, records) => {
        if (err) {
          console.error(err)
          res.status(400).json({success: false, message: 'An error occurred'})
        }

        records.forEach( r => {
            const d = r[0].split(';')
            const info = {}
            info.date = d[0]
            info.type = d[2].toLowerCase()
            info.value = d[1]
            info.method = d[3]

            switch(info.type) {
                case 'weight':
                    weight.push(info)
                    break
                case 'waist':
                    waist.push(info)
                    break
                case 'hips':
                    hips.push(info)
            }
        })
      })
    const sleep = ms => new Promise(r => setTimeout(r, ms))
    await sleep(1000)
    
    

    if ( weight.length !== 0 ) {
        let queryWeight = ''
        weight.forEach((w, i) => {
            queryWeight = queryWeight.concat(`('${w.date}', ${w.value}, ${w.method}, ${userID})`)
            if ( i + 1 < weight.length ) queryWeight = queryWeight.concat(',')
        })

        try {

            const r = await db.query(`
                INSERT INTO weight(date, value, method_id, userid)
                VALUES ${queryWeight}
                RETURNING id, method_id
            `)

            r.rows.forEach((r, i) => {
                weight[i].id = r.id
                weight[i].methodID = r.method_id
                response.data.push(weight[i])
            })
            response.weight = true
            
            } catch (e) {
            console.log(e)
            response.weight = false
            response.waist = false
            response.hips = false
            return res.status(400).send(JSON.stringify(response)).end()
        }
    } 

    let queryWaist = ''

    if ( waist.length !== 0 ) {
        waist.forEach((w, i) => {
            queryWaist = queryWaist.concat(`('${w.date}', ${w.value}, ${w.method}, ${userID})`)
            if ( i + 1 < waist.length ) queryWaist = queryWaist.concat(',')
        })

        try {

            const r = await db.query(`
                INSERT INTO waist(date, value, method_id, userid)
                VALUES ${queryWaist}
                RETURNING id, method_id
            `)

            r.rows.forEach((r, i) => {
                waist[i].id = r.id
                waist[i].methodID = r.method_id
                response.data.push(waist[i])
            })

            response.waist = true
            
            } catch (e) {
            response.waist = false
            response.hips = false
            return res.status(400).send(JSON.stringify(response)).end()
        }
    } 

    let queryHips = ''

    if ( hips.length !== 0 ) {
        hips.forEach((w, i) => {
            queryHips = queryHips.concat(`('${w.date}', ${w.value}, ${w.method}, ${userID})`)
            if ( i + 1 < hips.length ) queryHips = queryHips.concat(',')
        })

        try {

            const r = await db.query(`
                INSERT INTO hips(date, value, method_id, userid)
                VALUES ${queryHips}
                RETURNING id, method_id
            `)

            r.rows.forEach((r, i) => {
                hips[i].id = r.id
                hips[i].methodID = r.method_id
                response.data.push(hips[i])
            })

            response.hips = true
            
            } catch (e) {
            response.hips = false
            return res.status(400).send(JSON.stringify(response)).end()
        }
    } 
    
    res.status(200).send(JSON.stringify(response)).end()

 })

 server.get('/api/admin/init', async (req, res) => {
    let response = {}

    //A sak ved... preco nie?
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await sleep(1000)

    try {
        const r = await db.query(`
            SELECT id, name, email, COALESCE(age, 0) AS age, COALESCE(height, 0) AS height, COALESCE(weight, 0) AS weight
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

server.post('/api/admin/adduser', async(req, res) => {
    const name = req.body.params.name
    const password = req.body.params.password
    const mail = req.body.params.mail
    const age = req.body.params.age
    const height = req.body.params.height
    const weight = req.body.params.weight

    const response = {}

    try {
        const r = await db.query(`
            INSERT INTO users(name, password, email, age, height, weight )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, name, email, age, height, weight
        `, [name, password, mail, age, height, weight])

        response.message = 'Success'
        response.userID = r.rows[0].id
        response.name = r.rows[0].name
        response.mail = r.rows[0].email
        response.age = r.rows[0].age
        response.height = r.rows[0].height
        response.weight = r.rows[0].weight
        res.status(200).send(JSON.stringify(response)).end()
    } catch(e) {
        console.log(e)
        if ( e.constraint === 'users_name_key' ) {
            response.message = 'Username already exists'
            res.status(400).send(JSON.stringify(response)).end()
        }
    }
})

server.delete('/api/admin/delete/:id', async (req, res) => {
    const { id } = req.params


    try {
        const r = await db.query(`
            DELETE
            FROM users 
            WHERE id = ${id};
            DELETE 
            FROM weight
            WHERE userid = ${id};
            DELETE 
            FROM waist
            WHERE userid = ${id};
            DELETE
            FROM hips
            WHERE userid = ${id};
        `)        
        res.status(200).send({'message': 'Success'}).end()

    } catch(e) {
        console.log(e)
        res.status(500).send(JSON.stringify({message: 'error', error: e})).end()
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

server.post('/api/admin/import', upload.single('file'), async(req, res) => {
    const response = {}
    const file = req.file
    const data = fs.readFileSync(file.path)
    const users = []

    response.users = []

    parse(data, (err, records) => {
        if (err) {
          console.error(err)
          res.status(400).json({success: false, message: 'An error occurred'})
        }

        records.forEach( r => {
            users.push(r[0])
        })
      })
    const sleep = ms => new Promise(r => setTimeout(r, ms))
    await sleep(1000)
    
    let query = ''

    users.forEach((u, index) => {
        const user = {}
        const data = u.split(';')
        user.name = data[0]
        user.email = data[2]
        user.age = data[3]
        user.height = data[4]
        user.weight = data[5]
        response.users.push(user)
        query = query.concat(`('${data[0]}', '${data[1]}', '${data[2]}', ${data[3]}, ${data[4]}, ${data[5]})`)
        if ( index < users.length - 1 ) query = query.concat(',')
    })

    //pokial je cesta, ako toto spravit cez prepared statement, rad sa ju dozviem
    try {
        const r = await db.query(`
            INSERT INTO users(name, password, email, age, height, weight)
            VALUES ${query}
            RETURNING id
        `)

        r.rows.forEach((r, i) => {
            response.users[i].id = r.id
        })

       /* const rr = await db.query(`
            DELETE
            FROM users
            WHERE id < $1 AND id != 0
        `, [r.rows[0].id])*/

        res.status(200).send(JSON.stringify(response)).end()
    } catch(e) {
        console.log(e)
        res.status(500).end()
    }

    res.status(200).end()

})

 server.get('/api/admin/adds', async(req, res) => {
    const response = {}
    try {
        const r = await db.query(`
            SELECT *
            FROM add
            ORDER BY id
        `)
        response.message = 'Success'
        response.data = r.rows

        res.status(200).send(JSON.stringify(response)).end()

    } catch (e) {
        console.log(e)
        response.message = 'Server error'
        response.error = e

        res.status(500).send(JSON.stringify(response)).end()
    }
 })


server.patch('/api/adds/inc/:id', async(req, res) => {
    const { id } = req.params
    const response = {}

    try {
        const r = await db.query(`
            UPDATE add
            SET count = count + 1
            WHERE id = $1
            RETURNING count
        `, [id])

        response.message = 'Success'
        response.data = r.rows[0]
        res.status(200).send(JSON.stringify(response)).end()
        
    } catch(e) {
        console.log(e)
        response.message = 'Server error'
        response.error = e
        res.status(500).send(JSON.stringify(response)).end()
    }
 })



server.listen(port, ()=> console.log('Im running biatch'))