// all module imports here
import express from 'express'
import http from 'http'
import { listen } from 'socket.io'

// all relaive imports here
import config from '../config.json'

// global variables
const PORT = config.port
const app = express()
app.server = http.createServer(app)
const io = listen(app.server, { pingTimeout: 30000 })

// all http routes here
app.get('/*', (req, res) => res.send('hello')) // TODO: render the actual frontend

// all socket routes
io.sockets.on('connection', socket => {
    console.log('A fucker just joined on', socket.id)
    socket.on('message', data => {
    	// process the message here... using nlp techniques
    	socket.emit('reply', { message: data.msg })
    })
})

// tell our app to listen to our port
app.server.listen(process.env.PORT || PORT, () => console.log(`Magic happens on ${app.server.address().port}`))