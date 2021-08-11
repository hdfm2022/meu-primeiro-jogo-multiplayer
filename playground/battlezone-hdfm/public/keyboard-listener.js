export default function createKeyboardListener(document) {
    const state = {
        observers: [],
        playerId: null
    }

    function registerPlayerId(playerId) {
        state.playerId = playerId
    }

    function unsubscribeAll() {
        state.observers = []
    }

    function subscribe(observerFunction) {
        state.observers.push(observerFunction)
    }

    function notifyAll(command) {
        for (const observerFunction of state.observers) {
            observerFunction(command)
        }
    }

    document.addEventListener('keydown', handleKeydown)

    function handleKeydown(event) {
        const keyPressed = event.key

        const command = {
            type: 'move-player',
            playerId: state.playerId,
            keyPressed
        }

        console.log('handleKeydown', command);
        notifyAll(command)
    }

    return {
        subscribe,
        registerPlayerId,
        unsubscribeAll
    }
}