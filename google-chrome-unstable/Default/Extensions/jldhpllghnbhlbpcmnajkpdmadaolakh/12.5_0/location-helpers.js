/*
 * For fetching the current location and title
 */
let CURRENT_LOCATION = {
    location: '',
    title: '',
}

function getCurrentLocationAndTitle() {
    return CURRENT_LOCATION
}

/*
 * For remebering the last viewed iframe URL
 */
let FRAME_SRC = null
function setFrameLocation(url) {
    if (url) {
        FRAME_SRC = url
        if (window.localStorage) localStorage['frame_src'] = url
    }
}

function getFrameLocation() {
    let saved = null

    if (window.localStorage) saved = window.localStorage['frame_src']

    if (saved) return saved
    else return FRAME_SRC
}

function getSession() {
    return window.localStorage
}

export {
    setFrameLocation,
    getFrameLocation,
    getSession,
    CURRENT_LOCATION,
    getCurrentLocationAndTitle,
}
