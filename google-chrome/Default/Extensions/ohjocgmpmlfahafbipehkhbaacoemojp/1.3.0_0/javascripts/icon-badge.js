async function setIconAndBadge() {

    let offIconPath = {
        path: "images/icon16_off.png",
    };

    let onIconPath = {
        path: "images/icon16.png",
    };

    const errorBadgeText = chrome.i18n.getMessage("badge_error");
    const offBadgeText = chrome.i18n.getMessage("badge_off");
    const onBadgeText = 'ON';

    const errorState = await Utils.getStorage('_error_state');
    const connected = await Utils.getStorage('connected');

    if (errorState && errorState != "false" &&
        errorState != undefined &&
        errorState != "undefined" &&
        errorState != "WEBRTC_NOT_CONTROLLABLE") {
        var details = {
            text: errorBadgeText
        }
        
        chrome.action.setBadgeText(details);
        chrome.action.setBadgeBackgroundColor({ color: "#f00" });
        var icon = offIconPath;
        chrome.action.setIcon(icon);
        return;
    }


    if (!connected || connected === undefined) {
        var details = {
            text: offBadgeText
        }
        chrome.action.setBadgeText(details);
        chrome.action.setBadgeBackgroundColor({ color: "#0eaed2" });
        var icon = offIconPath;
        chrome.action.setIcon(icon);
    } else {
        var details = {
            text: onBadgeText
        }
        chrome.action.setBadgeText(details);
        var icon = onIconPath;
        chrome.action.setIcon(icon);
    }
}