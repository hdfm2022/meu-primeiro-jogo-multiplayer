export default function createGame() {
    const state = {
        zoneId: 0,
        players: {},
        monsters: {},
        screen: {
            width: 20,
            height: 20
        }
    }

    const observers = []

    function start() {
        console.log("acho que vou tirar");
        // const frequency = 2000
        // setInterval(addMonster, frequency)
    }

    function subscribe(observerFunction) {
        observers.push(observerFunction)
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command)
        }
    }

    function setState(newState) {
        Object.assign(state, newState)
    }

    function addPlayer(command) {
        const playerId = command.playerId
        const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width)
        const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)

        state.players[playerId] = {
            x: playerX,
            y: playerY
        }

        notifyAll({
            type: 'add-player',
            zoneId: state.zoneId,
            playerId: playerId,
            playerX: playerX,
            playerY: playerY
        })
    }

    function removePlayer(command) {
        const playerId = command.playerId

        delete state.players[playerId]

        notifyAll({
            type: 'remove-player',
            zoneId: state.zoneId,
            playerId: playerId
        })
    }

    function addMonster(command) {
        const monsterId = command ? command.monsterId : Math.floor(Math.random() * 10000000)
        const monsterX = command ? command.monsterX : Math.floor(Math.random() * state.screen.width)
        const monsterY = command ? command.monsterY : Math.floor(Math.random() * state.screen.height)

        state.monsters[monsterId] = {
            x: monsterX,
            y: monsterY
        }

        notifyAll({
            type: 'add-monster',
            monsterId: monsterId,
            monsterX: monsterX,
            monsterY: monsterY
        })
    }

    function removeMonster(command) {
        const monsterId = command.monsterId

        delete state.monsters[monsterId]

        notifyAll({
            type: 'remove-monster',
            monsterId: monsterId,
        })
    }

    function movePlayer(command) {
        notifyAll(command)

        const acceptedMoves = {
            ArrowUp(player) {
                if (player.y - 1 >= 0) {
                    player.y = player.y - 1
                }
            },
            ArrowRight(player) {
                if (player.x + 1 < state.screen.width) {
                    player.x = player.x + 1
                }
            },
            ArrowDown(player) {
                if (player.y + 1 < state.screen.height) {
                    player.y = player.y + 1
                }
            },
            ArrowLeft(player) {
                if (player.x - 1 >= 0) {
                    player.x = player.x - 1
                }
            }
        }

        const keyPressed = command.keyPressed
        const playerId = command.playerId
        const player = state.players[playerId]
        const moveFunction = acceptedMoves[keyPressed]

        if (player && moveFunction) {
            moveFunction(player)
            checkForMonsterCollision(playerId)
        }

    }

    function checkForMonsterCollision(playerId) {
        const player = state.players[playerId]

        for (const monsterId in state.monsters) {
            const monster = state.monsters[monsterId]
            console.log(`Checking ${playerId} and ${monsterId}`)

            if (player.x === monster.x && player.y === monster.y) {
                console.log(`COLLISION between ${playerId} and ${monsterId}`)
                removeMonster({ monsterId: monsterId })
            }
        }
    }

    return {
        addPlayer,
        removePlayer,
        movePlayer,
        addMonster,
        removeMonster,
        state,
        setState,
        subscribe,
        start
    }
}
