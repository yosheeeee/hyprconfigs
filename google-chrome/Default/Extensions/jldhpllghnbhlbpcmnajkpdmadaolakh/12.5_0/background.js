import { browserApi } from './browserApi.js'
import { CURRENT_LOCATION } from './location-helpers.js'

const DOMAIN = 'app.todoist.com'
const QUICK_ADD_WIDTH = 550
const QUICK_ADD_HEIGHT = 380
const QUICK_ADD_URL = 'https://app.todoist.com/add?'

const DOIST_HEADERS_PLATFORM_KEY = 'Doist-Platform'
const DOIST_HEADERS_WRAPPER_VERSION_KEY = 'Doist-WrapperVersion'

const TODOIST_CLIENT_VERSION_WRAPPER = 'TodoistForChromium'

const CONTEXT_MENU_ITEM_ID = 'addToTodoist'

browserApi.onInstalled(function () {
    setInterval(function () {
        browserApi.withActiveTab((tab) => {
            CURRENT_LOCATION.location = tab.url
            CURRENT_LOCATION.title = tab.title
        })
    }, 200)
})

/*
 * Option management
 */

const ExtensionOptions = {
    withDueToday: false,
}

function applyExtensionOptions(options) {
    ExtensionOptions.withDueToday = options.withDueToday
}

browserApi.getExtensionOptions(applyExtensionOptions)

browserApi.addExtensionOptionsChangedListener(() =>
    browserApi.getExtensionOptions(applyExtensionOptions),
)

function pad(num) {
    if (num < 10) {
        return '0' + num
    }
    return num
}

/*
 * Context menu adding
 */
function getQuickAddPosition(win) {
    if (win) {
        const top = win.height / 2 - QUICK_ADD_HEIGHT / 2 + win.top
        const left = win.width / 2 - QUICK_ADD_WIDTH / 2 + win.left
        return [top, left]
    } else {
        const top = screen.height / 2 - QUICK_ADD_HEIGHT / 2
        const left = screen.width / 2 - QUICK_ADD_WIDTH / 2
        return [top, left]
    }
}

function showTodoistQuickAdd(content, top, left, source = '') {
    const urlParams = new URLSearchParams()
    urlParams.append('content', encodeURIComponent(content))
    urlParams.append('view_mode', 'window')

    if (source) {
        urlParams.append('source', source)
    }
    if (ExtensionOptions.withDueToday) {
        urlParams.append('date', 'today')
    }
    browserApi.windowCreate(
        {
            url: QUICK_ADD_URL + urlParams.toString(),
            type: 'popup',
            width: QUICK_ADD_WIDTH,
            height: QUICK_ADD_HEIGHT,
            top: Math.round(top),
            left: Math.round(left),
        },
        true,
    )
}

function addToTodoistFromMenu(info, tab) {
    const url = info.pageUrl

    const hasSelection = Boolean(info.selectionText) && info.selectionText.length > 0
    let text = hasSelection ? info.selectionText : tab?.title || ''

    let contentToAdd = url

    if (info.linkUrl === text) {
        contentToAdd = info.linkUrl
    } else if (text.length > 0) {
        text = text.replace(/\(/g, '[').replace(/\)/g, ']')
        text = text.replace(/https?:\/\/[^\s]+/g, '')
        contentToAdd = `[${text}](${url})`
    }

    // Add tab as task
    browserApi.windowGetCurrent(function (win) {
        const [top, left] = getQuickAddPosition(win)
        showTodoistQuickAdd(contentToAdd, top, left, hasSelection ? 'selection' : 'page')
    })
}

browserApi.onInstalled(function () {
    browserApi.contextMenuCreate({
        id: CONTEXT_MENU_ITEM_ID,
        title: browserApi.getLocalizedMessage('addToTodoist'),
        contexts: ['page', 'selection', 'link'],
    })
})

browserApi.onContextMenuClick(function (info, tab) {
    switch (info.menuItemId) {
        case CONTEXT_MENU_ITEM_ID:
            addToTodoistFromMenu(info, tab)
            break
        default:
            console.warn('Unrecognized context menu item:', info.menuItemId)
    }
})

function addToTodoistCommand() {
    browserApi.tabsQuery(
        {
            active: true,
            lastFocusedWindow: true,
        },
        function (tabs) {
            if (tabs.length > 0) {
                const tab = tabs[0]
                addToTodoistFromMenu({ pageUrl: tab.url }, tab)
            } else {
                const [top, left] = getQuickAddPosition()
                showTodoistQuickAdd('', top, left)
            }
        },
    )
}

browserApi.addCommandListener(function (command) {
    switch (command) {
        case 'add-to-todoist':
            addToTodoistCommand()
            break
        default:
            console.warn('Unrecognized command:', command)
    }
})

function addDoistVersionHeader(currentHeaders) {
    const { version } = browserApi.getRuntimeApi().getManifest()

    const wrapperVersionHeader = {
        name: DOIST_HEADERS_WRAPPER_VERSION_KEY,
        value: `${TODOIST_CLIENT_VERSION_WRAPPER}-Chrome/${version}`,
    }

    // We overwrite any previous headers with the same name.
    return currentHeaders
        .filter((x) => x.name.toLowerCase() !== DOIST_HEADERS_WRAPPER_VERSION_KEY)
        .concat([wrapperVersionHeader])
}

function addDoistPlatformHeader(currentHeaders) {
    const platformHeader = {
        name: DOIST_HEADERS_PLATFORM_KEY,
        value: 'Chrome',
    }

    // We overwrite any previous headers with the same name.
    return currentHeaders
        .filter((x) => x.name.toLowerCase() !== DOIST_HEADERS_PLATFORM_KEY)
        .concat([platformHeader])
}

if (chrome.declarativeNetRequest != undefined) {
    const { version } = browserApi.getRuntimeApi().getManifest()

    chrome.declarativeNetRequest.updateSessionRules(
        {
            removeRuleIds: [1],
            addRules: [
                {
                    id: 1,
                    priority: 1,
                    action: {
                        type: 'modifyHeaders',
                        requestHeaders: [
                            {
                                header: DOIST_HEADERS_PLATFORM_KEY,
                                operation: 'set',
                                value: 'Chrome',
                            },
                            {
                                header: DOIST_HEADERS_WRAPPER_VERSION_KEY,
                                operation: 'set',
                                value: `${TODOIST_CLIENT_VERSION_WRAPPER}-Chrome/${version}`,
                            },
                        ],
                    },
                    condition: {
                        urlFilter: '||app.todoist.com/*',
                        tabIds: [chrome.tabs.TAB_ID_NONE],
                    },
                },
            ],
        },
        () => {
            console.log('Declarative network request rules set.')
        },
    )
} else {
    browserApi.getWebRequestApi().onBeforeSendHeaders.addListener(
        function (details) {
            const requestHeaders = details.requestHeaders

            // tabId == -1 means that TD is loading in the add-in. Higher IDs mean that TD is loading in a tab, i.e., not within the extension.
            if (details.tabId !== -1) {
                return {
                    requestHeaders,
                }
            }

            const resultingHeaders = addDoistPlatformHeader(addDoistVersionHeader(requestHeaders))

            return {
                requestHeaders: resultingHeaders,
            }
        },
        {
            urls: [`*://${DOMAIN}/*`],
        },
        ['requestHeaders', 'blocking'],
    )
}
