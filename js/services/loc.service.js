import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
export const locService = {
    save,
    query,
    remove,
    get,
}

const LOC_KEY = 'LOC_DB'
_createLocs()

function query() {
    return storageService.query(LOC_KEY)
        .then(locs => {
            // if (gFilterBy.txt) {
            //     const regex = new RegExp(gFilterBy.txt, 'i')
            //     locs = locs.filter(pet => regex.test(pet.name))
            // }
            // if (gFilterBy.minScore) {
            //     locs = locs.filter(pet => pet.score >= gFilterBy.minScore)
            // }
            return locs
        })
}

function save(name, lat, lng) {
    const loc = _createLoc(name, lat, lng)
    if (loc.id) {
        return storageService.put(LOC_KEY, loc)
    } else {
        return storageService.post(LOC_KEY, loc)
    }
}

function remove(locId) {
    return storageService.remove(LOC_KEY, locId)
}

function get(locId) {
    return storageService.get(LOC_KEY, locId)
}

function _createDemoLocs() {
    const locNames = ['Bob', 'Charls', 'Chip']

    const locs = locNames.map(locName => {
        const loc = _createLoc(locName)
        loc.id = utilService.makeId()
        return loc
    })
    utilService.saveToStorage(LOC_KEY, locs)
}

function _createLoc(name, lat, lng) {
    const loc = {}
    // loc.id = utilService.makeId()
    loc.name = name || utilService.randomLocName(loc.type)
    loc.lat = lat || utilService.randomLoc()
    loc.lng = lng || utilService.randomLoc()
    loc.createdAt = Date.now()
    console.log("loc down ", loc);
    return loc
}

function _createLocs() {
    let locs = utilService.loadFromStorage(LOC_KEY)
    if (!locs || !locs.length) {
        _createDemoLocs()
    }
}



// var gFilterBy = { txt: '', minScore: 0 }
// _createPets()

// export const petService = {
//     getFilterBy,
//     setFilterBy
// }


// function getFilterBy() {
//     return { ...gFilterBy }
// }

// function setFilterBy(filterBy = {}) {
//     if (filterBy.txt !== undefined) gFilterBy.txt = filterBy.txt
//     if (filterBy.minScore !== undefined) gFilterBy.minScore = filterBy.minScore
//     return gFilterBy
// }




