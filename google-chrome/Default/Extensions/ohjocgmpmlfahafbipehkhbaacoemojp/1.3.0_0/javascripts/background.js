'use strict'



chrome.runtime.onInstalled.addListener(function() {
    chrome.tabs.create({ url: "welcome.html" });
    Servers.createUpdateServersAlarm();
});


chrome.runtime.onMessage.addListener(async function(message, sender) {
    if (message.status === "error_update_bg") {
        chrome.runtime.sendMessage({ status: "error_update_popup" });
    } else {
        var tab = sender.tab;

        if (!tab)
            return;
        
        const createdTabIdStorage = await Utils.getStorage('_created_tab_id');
        var createdTabId = parseInt(createdTabIdStorage, 10);
        if (tab.id == createdTabId) {
            Utils.setStorage({'_quic_info': message.info})
            chrome.tabs.remove([createdTabId]);
            chrome.runtime.sendMessage({ status: "_quic_info" });
        }
    }
});



/* Trick to listen to popup close event */
chrome.runtime.onConnect.addListener(function(port) {
    if (port.name != "popup") {
        return;
    }
    port.onDisconnect.addListener(async function() {
        const alwaysEnableProxy = await Utils.getStorage('_always_enable_proxy');
        const connected = await Utils.getStorage('connected');
        if (alwaysEnableProxy && !connected) {
            await startSelectedProxy();
            await setIconAndBadge();
        }
    })
});

chrome.alarms.onAlarm.addListener(async function(alarm) {
    if (alarm.name === "PullServersAlarm") {
        Servers.pullAndUpdateProxyServers();
    }

    if (alarm.name === "ProxyTTLExpiredAlarm") {
        console.log("TTL expired");
        Servers.pullAndUpdateProxyServers();
        if(! await Proxy.proxyConnected()) {
            await Proxy.startNewProxyServer();
        }
    }
});

(async () => {
    await Servers.setServerListAndFlagsDefaults();
    await Privacy.disableWebRTCByDefault();
})();
Servers.pullAndPrepareFallbackServers();
Proxy.useNormalProxy();
Proxy.monitorProxyErrors();
Servers.pullAndUpdateProxyServers();
