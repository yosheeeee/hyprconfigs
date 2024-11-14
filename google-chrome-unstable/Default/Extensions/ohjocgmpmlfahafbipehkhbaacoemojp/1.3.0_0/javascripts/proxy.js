"use strict";

let Proxy = {};

Proxy.notControllableError = "PROXY_NOT_CONTROLLABLE";
Proxy.proxyError = "proxy_error";

/*
 * Checks to see if proxy settings of the browser is controllable by this extension.
 */
Proxy.checkProxyState = async function () {
    chrome.proxy.settings.get({ incognito: false }, async function (config) {
        let levelOfControl = config.levelOfControl;
        if (
            levelOfControl === LevelOfControl.OTHER_EXTENSION ||
            levelOfControl === LevelOfControl.NOT_CONTROLLABLE
        ) {
            let errorState = Proxy.notControllableError;
            let errorMessage = Utils.getErrorMessage(errorState);

            Utils.setStorage({ _error_state: errorState });
            Utils.setStorage({ _error_message: errorMessage });
            await Proxy.sendErrorUpdate();
        }
    });
};

/*
 * Saves current proxy settings as previous proxy configurations
 */
Proxy.saveOldProxyConfig = function () {
    chrome.proxy.settings.get({ incognito: false }, function (config) {
        Utils.setStorage({ _prev_proxy_config: config.value });
    });
};

/*
 * Creates cofiguration for selected server ip address and port.
 * Sets the creted configuration as current proxy settings of the browser.
 * If error occurs, sets the error state to proxy error. Otherwise creates alarm
 * for doing TTL expiration of the proxy server settings.
 */
Proxy.startSelectedProxy = async function () {
    Utils.setStorage({ connected: true });
    Proxy.clearProxyError();
    const selectedServer = await Utils.getStorage("_selected_server");
    const bypassLocalhost = await Utils.getStorage("_bypass_localhost");
    const bypassOptions = await Utils.getStorage("_bypass_options");
    let serverInfo = selectedServer;
    let config = Proxy.GenerateProxyConfig(
        serverInfo,
        bypassLocalhost,
        bypassOptions,
    );
    Proxy.saveOldProxyConfig();
    chrome.proxy.settings.set(config, function () {
        if (chrome.runtime.lastError) {
            Proxy.setProxyError(Utils.getErrorMessage(Proxy.proxyError));
            console.log(
                "Error Setting Regular Proxy ",
                chrome.runtime.lastError,
            );
        } else {
            Servers.createProxyTTLExpiredAlarm(serverInfo);
        }
    });
};

/*
 * Starts proxy only if extension is in connected state.
 * Have seen this pattern occuring few times. So worth refactoring into its own
 * method and testing once.
 */
Proxy.startProxyIfConnected = async function () {
    if (await this.proxyConnected()) {
        await this.startSelectedProxy();
    }
};

/*
 * Clears the current proxy settings and makes the connection direct.
 */
Proxy.stopProxy = function () {
    Servers.clearTTLExpiredAlarm();
    Utils.setStorage({ connected: false });

    let config;

    if (Utils.isChrome()) {
        config = {
            value: {
                mode: "system",
            },
            scope: "regular",
        };
    } else {
        config = { value: { proxyType: "system" } };
    }

    chrome.proxy.settings.set(config, function () {
        console.log("Cleared the settings");
    });

    Proxy.clearProxyError();
    Proxy.useNormalProxy();
};

/*
 * Sets the error state to `proxy_error` and sets passed error messasge as error_message value.
 */
Proxy.setProxyError = async function (error_message) {
    Utils.setStorage({ connected: false });
    Utils.setStorage({ _error_state: this.proxyError });
    Utils.setStorage({ _error_message: error_message });
    await Proxy.sendErrorUpdate();
};

/*
 * Clears the error state and sets it to false if its `proxy_error`
 */
Proxy.clearProxyError = async function () {
    if (await Proxy.inProxyErrorState()) {
        Utils.clearErrorState();
        await Proxy.sendErrorUpdate();
    }
};

/* Starts new  proxy server with largest remaining TTL value */
Proxy.startNewProxyServer = async function () {
    const serverList = await Utils.getStorage("_servers_list");
    let servers = serverList;
    let serverArray = [];
    let now = Date.now();
    let maxTTL = -1;
    let maxServer = null;

    for (let serverName in servers) {
        if (!servers.hasOwnProperty(serverName)) {
            continue;
        }

        serverArray.push(servers[serverName]);
    }

    for (let i in serverArray) {
        let serverInfo = serverArray[i];
        let remainingTTL = Servers.remainingTTLUsingNow(now, serverInfo);

        if (remainingTTL > maxTTL) {
            maxServer = serverInfo;
            maxTTL = remainingTTL;
        }
    }

    console.log("MAX TTL:", maxTTL);
    if (maxTTL <= 0) {
        // Proxy.setProxyError("Could not find  server with positive remaining TTL, need to refresh the list of servers");
        return;
    }

    const selectedServerStorage = await Utils.getStorage("_selected_server");
    let selectedServer = selectedServerStorage;
    let newSelectedServer = Object.assign({}, maxServer);
    newSelectedServer.name = selectedServer.name;
    Utils.setStorage({ _selected_server: newSelectedServer });
    await Proxy.startProxyIfConnected();
};

Proxy.selectProxyServer = async function (serverName) {
    const serverList = await Utils.getStorage("_servers_list");
    let servers_list = serverList;
    Utils.setStorage({ _selected_server: servers_list[serverName] });
};

Proxy.selectPrevProxyServer = async function (serverName) {
    const serverList = await Utils.getStorage("_servers_list");
    let servers_list = serverList;
    Utils.setStorage({ _prev_server: servers_list[serverName] });
};

Proxy.enableHidemeProxy = async function () {
    Utils.setStorage({ _enable_socks: true });
    Utils.setStorage({ _prev_server: true });

    const selectedServerStorage = await Utils.getStorage("_selected_server");
    let selectedServer = selectedServerStorage;
    Utils.setStorage({ _prev_server: selectedServer });
    await Proxy.selectProxyServer(Servers.hidemeProxyName);
    await Proxy.startProxyIfConnected();
};

Proxy.disableHidemeProxy = async function () {
    Utils.setStorage({ _enable_socks: false });
    await Proxy.restorePrevServer();
    await Proxy.startProxyIfConnected();
};

Proxy.setAlwaysEnableProxy = function () {
    Utils.setStorage({ _always_enable_proxy: true });
};

Proxy.unsetAlwaysEnableProxy = function () {
    Utils.setStorage({ _always_enable_proxy: false });
};

Proxy.enableAutomaticFallback = function () {
    Utils.setStorage({ _auto_fallback: true });
};

Proxy.disableAutomaticFallback = function () {
    Utils.setStorage({ _auto_fallback: false });
};

Proxy.updateSelectedProxyServer = async function () {
    let name = "Automatic";
    const selectedServerStorage = await Utils.getStorage("_selected_server");
    let selectedServer = selectedServerStorage;

    if (selectedServer) {
        name = selectedServer.name;
    }

    let id = await Servers.serverNameToIdentifier(name);
    await Proxy.selectProxyServer(id);
};

Proxy.ProxyTypes = {
    AUTO: "auto_detect",
    PAC: "pac_script",
    DIRECT: "direct",
    FIXED: "fixed_servers",
    SYSTEM: "system",
};

Proxy.GenerateProxyConfig = function (
    serverInfo,
    bypassLocalhost,
    bypassOptions,
) {
    let bypass = ["localhost", Servers.proxyAPIServerIP];

    if (bypassLocalhost) {
        bypass.push("<-loopback>");
    }

    if (bypassOptions.length) {
        bypass.push(...bypassOptions);
    }

    console.log(bypass);

    if (Utils.isChrome()) {
        let config = { mode: "fixed_servers" };

        config.rules = {
            singleProxy: {
                scheme: "socks5",
                host: serverInfo.host,
                port: serverInfo.port,
            },
            bypassList: bypass,
        };
        return { value: config, scope: "regular" };
    } else {
        let config = {
            proxyType: "manual",
            socks: serverInfo.host + ":" + serverInfo.port,
            socksVersion: 5,
            passthrough: bypass.join(", "),
        };
        return { value: config };
    }
};

Proxy.monitorProxyErrors = function () {
    var onError;

    if (typeof browser !== "undefined") {
        // Firefox
        onError = "onError";
    } else {
        // Chrome
        onError = "onProxyError";
    }

    chrome.proxy[onError].addListener(async function (error) {
        if (!(await Proxy.proxyConnected()) || (await Proxy.hidemeEnabled())) {
            return;
        }

        Utils.setStorage({ _error_state: Proxy.proxyError });
        Utils.setStorage({ _error_message: error });

        Proxy.fallback();
        await setIconAndBadge();
        await Proxy.sendErrorUpdate();
        Proxy.updatePopup();
    });
};

Proxy.fallback = async function () {
    /* Error occured while using hideme proxy. Disable
       hideme proxy, when using automatically fallback to
       fallback proxy. */
    if (!(await Proxy.hidemeEnabled())) {
        await Proxy.useFallbackProxy();
    }
};

Proxy.useFallbackProxy = async function () {
    console.log("using fallback proxy");
    const fallbackCountStorage = await Utils.getStorage("_fallback_count");
    let fallbackCount = parseInt(fallbackCountStorage, 10);
    if (await Proxy.isInFallenBackState()) {
        if (fallbackCount != NaN && fallbackCount < 3) {
            await Proxy.startSelectedProxy();
            fallbackCount++;
            Utils.setStorage({ _fallback_count: fallbackCount });
        }

        return;
    }

    Proxy.enableFallenBackState();
    Utils.setStorage({ _fallback_count: 1 });

    /* USE OF FALLBACK SERVERS IS DISABLED FOR NOW */
    // let arr = JSON.parse(localStorage._fallback_servers_list);
    // let random_server = arr[Math.floor(Math.random() * arr.length)];
    // random_server.name = "Automatic";

    // localStorage._prev_server = localStorage._selected_server;
    // localStorage._selected_server = JSON.stringify(random_server);
    // startSelectedProxy();

    Utils.setStorage({ _prev_server: fallbackCount });
    const selectedServerStorage = Utils.getStorage("_selected_server");
    let selectedServer = selectedServerStorage;
    Utils.setStorage({ _prev_server: selectedServer });
    await Proxy.startNewProxyServer();
};

Proxy.useNormalProxy = async function () {
    if (await Proxy.isInFallenBackState()) {
        Proxy.disableFallenBackState();
        await Proxy.restorePrevServer();
        Proxy.updatePopup();
        await Proxy.startProxyIfConnected();
    }
};

Proxy.updatePopup = function () {
    // let arr = chrome.extension.getViews({ type: "popup" });
    // if (arr.length > 0) {
    //     /* Descriptor of popup view */
    //     let popup = arr[0];
    //
    //     /* Calls a method defined in popup window only. */
    //     /* This will update the popup window, only if extension popup
    //      is currently open */
    //     console.log("updating popup:", popup);
    //
    //     /* TODO: Add test for popup.js that adds showError on window Popup's scope */
    //     popup.showError();
    // }
};

Proxy.restorePrevServer = async function () {
    const selectedServerStorage = await Utils.getStorage("_prev_server");
    if (selectedServerStorage) {
        let prevServer = selectedServerStorage;
        Utils.setStorage({ _selected_server: prevServer });
    }
    Utils.setStorage({ _prev_server: null });
};

Proxy.sendErrorUpdate = async function () {
    const errorState = await Utils.getStorage("_error_state");
    const errorMessage = await Utils.getStorage("_error_message");

    let message = {
        status: "error_update_bg",
        error_state: errorState,
        error_message: errorMessage,
    };
    console.log("Sending Error Update, message  = ", message);
    chrome.runtime.sendMessage(message);
};

Proxy.enableFallenBackState = function () {
    Utils.setStorage({ _fallen_back: true });
};

Proxy.disableFallenBackState = function () {
    Utils.setStorage({ _fallen_back: false });
};

Proxy.isInFallenBackState = async function () {
    return await Utils.getStorage("_fallen_back");
};

Proxy.hidemeEnabled = async function () {
    return await Utils.getStorage("_enable_socks");
};

Proxy.hidemeDisabled = async function () {
    return await Utils.getStorage("_enable_socks");
};

Proxy.proxyConnected = async function () {
    const connected = await Utils.getStorage("connected");
    return connected;
};

Proxy.proxyAlwaysEnabled = async function () {
    const alwaysEnableProxy = await Utils.getStorage("_always_enable_proxy");
    return alwaysEnableProxy;
};

Proxy.autoFallbackIsSet = async function () {
    return await Utils.getStorage("_auto_fallback");
};

Proxy.inProxyNotControllableErrorState = async function () {
    return (
        (await Utils.getStorage("_error_state")) === this.notControllableError
    );
};

Proxy.inProxyErrorState = async function () {
    return (await Utils.getStorage("_error_state")) === this.proxyError;
};

Proxy.setSelectedServer = async function (serverName) {
    if (await this.hidemeEnabled()) {
        await this.selectPrevProxyServer(serverName);
    } else {
        await this.selectProxyServer(serverName);
    }
};
