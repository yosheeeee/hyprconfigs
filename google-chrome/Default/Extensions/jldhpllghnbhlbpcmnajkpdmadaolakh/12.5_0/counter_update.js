import { browserApi } from './browserApi.js'

let data

const pathname = window.location.pathname

if (pathname.indexOf('/app') != -1) {
    data = { type: 'init_ws_updates' }
} else if (pathname == '/') {
    data = { type: 'reset_ws_updates' }
}

if (data) {
    browserApi.sendRequest(data)
}
