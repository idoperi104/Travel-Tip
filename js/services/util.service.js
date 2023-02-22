export const utilService = {
    saveToStorage,
    loadFromStorage,
    makeId,
    randomPastTime,
    randomLocName,
    randomLoc,
}

const gLocNames = ['Bob', 'Charls', 'Chip']

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}

function makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomLocName() {
    return gLocNames[parseInt(Math.random() * gLocNames.length)]
}

function randomLoc() {
    return +('31.' + `${getRandomIntInclusive(1345, 7890)}`)
}

function randomPastTime() {
    const HOUR = 1000 * 60 * 60
    const DAY = 1000 * 60 * 60 * 24
    const WEEK = 1000 * 60 * 60 * 24 * 7
    
    const pastTime = getRandomIntInclusive(HOUR, WEEK)
    return Date.now() - pastTime
}