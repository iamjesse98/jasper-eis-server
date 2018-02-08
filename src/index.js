// all module imports here
import express from 'express' // for rendering documents and handling requests
import http from 'http' // http connects both express and socket.io
import { listen } from 'socket.io' // for real time data streaming

// all relative imports here
import config from '../config.json' // this file contains all the configs.

// global variables
const PORT = config.port
const app = express()
app.server = http.createServer(app)
const io = listen(app.server, { pingTimeout: 30000 }) // { pingTimeout: 30000 } => makes compatible with react-native

// all http routes here
app.get('/*', (req, res) => res.send('hello')) // TODO: render the actual frontend

// all socket routes goes here
io.sockets.on('connection', socket => {
    console.log('A fucker just joined on', socket.id)
    socket.on('message', data => {
    	// process the message here... using nlp techniques, then emit the reply to client and also to raspberry pi server
    	socket.emit('reply', { message: data.msg })
    })
})

// tell our app to listen to our port
app.server.listen(process.env.PORT || PORT, _ => console.log(`Magic happens on ${app.server.address().port}`))