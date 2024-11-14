export const browserApi = {
    withActiveTab: function (action) {
        this.tabsQuery({ active: true, currentWindow: true }, function (tabs) {
            if (tabs && tabs.length > 0) {
                action(tabs[0])
            }
        })
    },

    tabsQuery: function (query, action) {
        chrome.tabs.query(query, action)
    },

    tabsUpdate: function (id, data) {
        chrome.tabs.update(id, data)
    },

    sendRequest: function (message) {
        chrome.extension.sendRequest(message, function () {})
    },

    addRequestListener: function (listener) {
        chrome.extension.onRequest.addListener(listener)
    },

    addCommandListener: function (listener) {
        chrome.commands.onCommand.addListener(listener)
    },

    getExtensionOptions: function (callback) {
        function readOptionFromStorage() {
            chrome.storage.sync.get(['withDueToday'], function (items) {
                callback({
                    withDueToday: items.withDueToday,
                })
            })
        }

        readOptionFromStorage()
    },

    addExtensionOptionsChangedListener: function (callback) {
        chrome.storage.onChanged.addListener(callback)
    },

    setExtensionOptions: function (options, callback) {
        chrome.storage.sync.set(options, callback)
    },

    windowCreate: function (window, _allowScriptsToClose) {
        chrome.windows.create(window)
    },

    windowGetCurrent: function (callback) {
        chrome.windows.getCurrent(callback)
    },

    contextMenuCreate: function (menu) {
        chrome.contextMenus.create(menu)
    },

    onContextMenuClick: function (listener) {
        chrome.contextMenus.onClicked.addListener(listener)
    },

    getLocalizedMessage: function (code) {
        return chrome.i18n.getMessage(code)
    },

    getBackgroundPage: function () {
        return chrome.extension.getBackgroundPage()
    },

    canAccessBackgroundPage: function () {
        return true
    },

    getWebRequestApi: function () {
        return chrome.webRequest
    },

    getRuntimeApi: function () {
        return chrome.runtime
    },

    onInstalled: function (listener) {
        chrome.runtime.onInstalled.addListener(listener)
    },
}
