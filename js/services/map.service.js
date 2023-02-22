import { locService } from './loc.service.js'
import { appController } from '../app.controller.js'
export const mapService = {
    initMap,
    addMarker,
    panTo,
    getMarkers,
    setMarkers
}


// Var that is used throughout this Module (not global)
var gMap
var gMarkers = []

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            gMap.addListener("click", (ev) => {
                const lat = ev.latLng.lat()
                const lng = ev.latLng.lng()
                const name = prompt('what is the name of this place?')
                const marker = addMarker({ lat, lng }, name)
                gMarkers.push(marker)
                locService.save(name, lat, lng)
                    .then(appController.renderLocsList)
                // info window - google maps
            })
            console.log('Map!', gMap)
        })
}

function addMarker(loc, title) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title
    })
    return marker
}

function getMarkers() {
    return gMarkers
}

function setMarkers(markers) {
    gMarkers = markers
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyCpUT0P_MEDeD10d-0Gf6k3OQxiGkC_GS4' //Enter your API Key
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}