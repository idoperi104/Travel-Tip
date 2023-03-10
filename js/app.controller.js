import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

export const appController = {
    renderLocsList
}

window.onload = onInit
window.onPanTo = onPanTo
window.onGetUserPos = onGetUserPos
window.onRemoveMarker = onRemoveMarker
window.onSearch = onSearch

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
        })
        .then(renderLocsList)
        .then(renderMarkers)
        .then(onGetUserPos)
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
            console.log("locs: ", locs);
            const strHtml = locs.map(loc => {
                return `<div class="loc-preview">
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

function renderMarkers() {
    locService.query()
        .then(locs => {
            let markers = mapService.getMarkers()
            markers.forEach(marker => marker.setMap(null))
            markers = locs.map(loc => mapService.addMarker({ lat: loc.lat, lng: loc.lng }, loc.name))
            mapService.setMarkers(markers)
        })
}

function onRemoveMarker(locId) {
    locService.remove(locId)
        .then(renderLocsList)
        .then(renderMarkers)
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
            return { lng: pos.coords.longitude, lat: pos.coords.latitude }
        })
        .then(({ lat, lng }) => {
            const name = 'My Location'
            const marker = mapService.addMarker({ lat, lng }, name)
            mapService.getMarkers().push(marker)
            locService.save(name, lat, lng)
                .then(renderLocsList)
            return {lat, lng}
        })
        .then(({lat, lng}) => onPanTo(lat, lng))
        .catch(err => {
            console.log('err!!!', err)
        })
}

function onPanTo(lat, lng) {
    mapService.panTo(lat, lng)
}

function onSearch(ev){
    ev.preventDefault()
    var elInput = document.querySelector('.search-input')
    var locName = elInput.value
    elInput.value = ''

    mapService.getAddressLoc(locName)


}