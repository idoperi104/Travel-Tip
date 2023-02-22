import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onRemoveMarker = onRemoveMarker

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
        })
        .then(renderLocsList)
        .catch(() => console.log('Error: cannot init map'))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}


function renderLocsList() {
    locService.query()
        .then(locs => {
            const strHtml = locs.map(loc => {
                return `<div>
                <h2>${loc.name}</h2>
                <p>Created at: ${new Date(loc.createdAt)}</p>
                <button onclick="onPanTo(${loc.lat}, ${loc.lng})">Go</button>
                <button onclick="onRemoveMarker('${loc.id}')">Delete</button>
                </div>`
            })
            const elLocList = document.querySelector('.loc-list')
            elLocList.innerHTML = strHtml.join('')
        })
}

function onRemoveMarker(locId) {
   locService.remove(locId).then(renderLocsList)
}

function onGetLocs() {
    locService.query()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
        })
        .then(renderLocsList)
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}
function onPanTo(lat, lng) {
    mapService.panTo(lat, lng)
}