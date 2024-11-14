'use strict'



let Privacy = {};
Privacy.notControllableWebRTC = "WEBRTC_NOT_CONTROLLABLE";
Privacy.webRTCError = "webrtc_error";
Privacy.hidemeWebRTCDisablePolicy = "disable_non_proxied_udp";


/* Checks if extension can control webRTC settings, sets an error state if 
   can't. If extension can control settings, runs provided callback. */
Privacy.checkWebRTCState = async function(callback) {
    chrome.privacy.network.webRTCIPHandlingPolicy.get({}, async function(config) {
        let levelOfControl = config.levelOfControl;
        if (levelOfControl === LevelOfControl.OTHER_EXTENSION ||
            levelOfControl === LevelOfControl.NOT_CONTROLLABLE) {
            
            const webrtcDisabled = await Privacy.webRTCDisabled();
            /* If user has unset 'disable webrtc setting', we don't report 
               an error .*/
            if (!webrtcDisabled || await Proxy.inProxyNotControllableErrorState()) {
                return;
            }

            let errorState = Privacy.notControllableWebRTC;

            Utils.setStorage({'_error_state': errorState});
            Privacy.sendWebRTCErrorUpdate();
        } else {
            Privacy.clearWebRTCError();
            if (callback != undefined)
                callback(config);
        }
    });
}




/* Uses checkWebRTCState to see if it is  possible to disable webRTC, if possible
   disables webRTC IP leakage. */
Privacy.checkAndSetWebRTCIPHandlingPolicy = function(policyValue) {
    Privacy.checkWebRTCState(function(config) {
        Privacy.setWebRTCIPHandlingPolicy(policyValue);
    });
}


Privacy.setWebRTCIPHandlingPolicy = function(policyValue) {
    if ((typeof browser !== "undefined")) { // Firefox only
        chrome.privacy.network.peerConnectionEnabled.set({ value: policyValue === 'default' ? true : false });
    }
    chrome.privacy.network.webRTCIPHandlingPolicy.set({ value: policyValue }, function() {
        if (chrome.runtime.lastError) {
            Utils.setStorage({'_error_state': Privacy.webRTCError});
            Utils.setStorage({'_error_message': chrome.runtime.lastError});
            Privacy.sendWebRTCErrorUpdate();
        }
    });
}

Privacy.disableWebRTC = function() {
    Privacy.clearWebRTCError();
    Privacy.checkAndSetWebRTCIPHandlingPolicy(Privacy.hidemeWebRTCDisablePolicy);
    Utils.setStorage({'_webrtc_disabled': true});
};

Privacy.enableWebRTC = async function() {
    let prev = await Utils.getStorage('_prev_webRTCIPHandlingPolicy');
    if (!prev) {
        prev = "default";
    }
    Utils.setStorage({'_webrtc_disabled': false});
    Privacy.setWebRTCIPHandlingPolicy('default');
    Privacy.clearWebRTCError();
}


Privacy.clearWebRTCError = async function() {
    const inWebRTCErrorState = await Privacy.inWebRTCErrorState();
    const inWebRTCNotControllableErrorState = await Privacy.inWebRTCNotControllableErrorState();
    if (inWebRTCErrorState || inWebRTCNotControllableErrorState) {
        Utils.clearErrorState();
        Privacy.sendWebRTCErrorUpdate();
    }
}

/*
 * If web rtc policy has been changed before, we don't need to
 * touch webRTC settings. 
 */
Privacy.disableWebRTCByDefault = async function() {
    const webrtcDisabled = await Utils.getStorage('_webrtc_disabled');
    if (!!webrtcDisabled) {
        return;
    }

    Privacy.checkWebRTCState(function(config) {
        Utils.setStorage({'_prev_webRTCIPHandlingPolicy': config.value});
    });
    Privacy.disableWebRTC();
}

Privacy.sendWebRTCErrorUpdate = function() {
    chrome.runtime.sendMessage({ status: "error_update_bg" });
}

Privacy.webRTCDisabled = async function() {
    return await Utils.getStorage('_webrtc_disabled')
}

Privacy.inWebRTCErrorState = async function() {
    return await Utils.getStorage('_error_state') === Privacy.webRTCError;
}

Privacy.inWebRTCNotControllableErrorState = async function() {
    return await Utils.getStorage('_error_state') === Privacy.notControllableWebRTC;
}