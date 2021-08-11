import express from 'express'
import http from 'http'
import createGame from './server/game.js'
import socketio from 'socket.io'

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

app.use(express.static('public'))

const mapas = [];
mapas[0] = createGame(0);

const game = createGame()
game.start()

game.subscribe((command) => {
    const zoneId = "zoneId" in command ? command.zoneId : null;
    console.log(`> Emitting ${command.type} | zone = ${zoneId}`)
    sockets.emit(command.type, command)
})

sockets.on('connection', (socket) => {
    const playerId = socket.id
    console.log(`> Player connected: ${playerId}`)

    game.addPlayer({ playerId: playerId, playerX: 1, playerY: 1 })

    socket.emit('setup', game.state)

    socket.on('disconnect', () => {
        game.removePlayer({ playerId: playerId })
        console.log(`> Player disconnected: ${playerId}`)
    })

    socket.on('move-player', (command) => {
        console.log(`> Player send move-player`, command)
        command.playerId = playerId
        command.type = 'move-player'
        
        game.movePlayer(command)
    })
})

server.listen(3000, () => {
    console.log(`> Server listening on port: 3000`)
})