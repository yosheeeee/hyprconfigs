'use strict'

let Utils = {};
let LevelOfControl = {
    NOT_CONTROLLABLE: 'not_controllable',
    OTHER_EXTENSION: 'controlled_by_other_extensions',
    AVAILABLE: 'controllable_by_this_extension',
    CONTROLLING: 'controlled_by_this_extension'
};

Utils.getErrorMessage = function(errorState) {
    Utils.error_messages = {
        "PROXY_NOT_CONTROLLABLE": chrome.i18n.getMessage("proxy_not_controllable_error"),

        "WEBRTC_NOT_CONTROLLABLE": chrome.i18n.getMessage("webrtc_not_controllable_error"),
        "proxy_error": chrome.i18n.getMessage("proxy_setting_error"),
        "proxy_connection_error": chrome.i18n.getMessage("proxy_connection_error")
    };

    return Utils.error_messages[errorState];
};

Utils.clearErrorState = function() {
    chrome.storage.sync.remove(['_error_state']);
}

Utils.noError = async function() {
    const errorState = await Utils.getStorage('_error_state');
    return !errorState;
}

Utils.isChrome = function() {
    return (typeof browser === "undefined");
}

Utils.getStorage = function (key) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get([key], (item) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(item[key] ? item[key] : false);
        });
    });
}

Utils.setStorage = function (obj) {
    chrome.storage.sync.set(obj);
}