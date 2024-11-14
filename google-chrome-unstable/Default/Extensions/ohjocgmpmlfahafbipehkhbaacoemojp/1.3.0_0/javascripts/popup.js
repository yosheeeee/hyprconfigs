/*
 * main script loaded with popup.html
 */


/*
 * Functionality for controlling the behaviour of control elements,
 * and view of the extension.
 */


let Popup = {};
Popup.enableSocksToggleID = "#cmn-toggle-3";
Popup.automaticFallbackToggleID = "#cmn-toggle-5";
Popup.notControllableAlert = ".not_controllable_alert";
Popup.disableProxyMesssage = chrome.i18n.getMessage("disable_proxy_message");
Popup.disableSOCKSMessage = chrome.i18n.getMessage("disable_socks_message");
Popup.disableAutomaticFallbackMessage = chrome.i18n.getMessage("disable_automatic_fallback_message");
Popup.disconnectedText = chrome.i18n.getMessage("status_disconnected");
Popup.connectedText = chrome.i18n.getMessage("status_connected");


document.addEventListener('DOMContentLoaded', async function() {
    /* Clear the error state to blank state since there are no controls to 
    to remove the error message if extension was in proxy uncontrollable state. User needs to resolve the problem and restart the extension to reset the 
    error state. */
    Utils.clearErrorState();
    await Localization.resetI18n(Localization.localizeHtmlPage);
    await setIconAndBadge();
    Proxy.checkProxyState();
    Privacy.checkWebRTCState();
    Popup.showError();
    Popup.monitorProxyToggleSwitch();
    Popup.monitorWebRTCSetting();
    Popup.monitorEnableSocks();
    Popup.monitorAlwaysEnableProxy();
    // Popup.monitorAutomaticFallback();
    Popup.monitorSettingsView();
    Popup.monitorLanguageSelect();
    Popup.monitorBypass();
    Popup.monitorLinkClicks();
    Popup.monitorErrorButtons();
    Popup.addFirefoxScrolling();
    await Popup.restoreProxyConnectToggle();
    await Popup.getInitialBypassSettings();
    Popup.monitorServerSelect();
});

Popup.restoreExtensionState = async function() {
    this.restoreProxyConnectToggle();
    this.restoreDisableWebRTCToggle();
    await this.restoreEnableSocksToggle();
    await this.restoreProxyAlwaysEnabledToggle();
    await this.bypassLocalhost();
    // await this.restoreAutoFallbackToggle();
    await Popup.showSelectedServer();
    await setIconAndBadge();
};

Popup.monitorBypass = function () {
    $("#cmn-toggle-5").change(async function() {
        if (this.checked) {
            Utils.setStorage({'_bypass_localhost': true})
        } else {
            Utils.setStorage({'_bypass_localhost': false})
        }
        await Popup.restoreExtensionState();
    });
}

Popup.monitorBypassSettings = function () {
    const area = document.getElementById("bypass_options");             
    const save = document.getElementById("bypass_options_save");             
    
    save.addEventListener('click', async function(){
        const options = area.value.replace(/\r\n/g,"\n").split("\n").filter(line => line);
        Utils.setStorage({'_bypass_options': options})
        await Popup.getInitialBypassSettings();
        Popup.hideBypassSettings();
    });
}

Popup.getInitialBypassSettings = async function () {
    const options = await Utils.getStorage('_bypass_options');
    const view = document.querySelector('#bypass_settings_view');

    if (options && options.length) {
        view.querySelector('.on').classList.remove('hidden');
        view.querySelector('.off').classList.add('hidden');
        document.querySelector("#bypass_options").value = options.join('\n'); 
    } else {
        view.querySelector('.on').classList.add('hidden');
        view.querySelector('.off').classList.remove('hidden');
    }
}

Popup.restoreProxyConnectToggle = async function() {
    if (await Proxy.proxyConnected()) {
        $(".main #cmn-toggle-1").prop("checked", true);
        this.indicateConnection();
    } else {
        $(".main #cmn-toggle-1").prop("checked", false);
        this.indicateDisconnect();
    }
}


Popup.restoreDisableWebRTCToggle = async function() {
    const webrtcDisabled = await Privacy.webRTCDisabled();
    if (webrtcDisabled) {
        $("#cmn-toggle-2").prop("checked", true);
    } else {
        $("#cmn-toggle-2").prop("checked", false);
    }
}


Popup.restoreProxyAlwaysEnabledToggle = async function() {
    if (await Proxy.proxyAlwaysEnabled()) {
        $("#cmn-toggle-4").prop("checked", true);
        Popup.disableToggles("#cmn-toggle-4");
    } else {
        $("#cmn-toggle-4").prop("checked", false);
        if (await Proxy.proxyConnected()) {
            Popup.disableToggles("#cmn-toggle-1");
        }
    }
}

Popup.bypassLocalhost = async function() {
    const bypassLocalhost = await Utils.getStorage('_bypass_localhost');
    if (bypassLocalhost) {
        $("#cmn-toggle-5").prop("checked", true);
    } else {
        $("#cmn-toggle-5").prop("checked", false);
    }
}


Popup.restoreEnableSocksToggle = async function() {
    if (await Proxy.hidemeEnabled()) {
        $("#cmn-toggle-3").prop("checked", true);
        this.disableSelectServer(Popup.disableSOCKSMessage);
        Popup.disableSingleToggle(Popup.automaticFallbackToggleID, Popup.disableSOCKSMessage);
    } else {
        $("#cmn-toggle-3").prop("checked", false);
        this.enableSelectServer();
    }
}


Popup.restoreAutoFallbackToggle = async function() {
    if (await Proxy.autoFallbackIsSet()) {
        $("#cmn-toggle-5").prop("checked", true);
        Popup.disableSingleToggle(Popup.enableSocksToggleID, Popup.disableAutomaticFallbackMessage);
    } else {
        $("#cmn-toggle-5").prop("checked", false);
    }
}


Popup.showSelectedServer = async function() {
    let selectedProxyServer = await this.getSelectedServer();
    if (selectedProxyServer) {
        let selectedServerId = await Servers.serverNameToIdentifier(selectedProxyServer.name);
        let src = await Servers.flagSrc(selectedServerId);
        $(".selected_server .server_name").text(selectedProxyServer.name);
        $(".selected_server .server_flag img").attr("src", src);
    }
}


Popup.getSelectedServer = async function() {
    const selectedServer = await Utils.getStorage('_selected_server');
    if (selectedServer){
        return selectedServer;
    }
}


Popup.monitorProxyToggleSwitch = async function() {
    $(".main #cmn-toggle-1").change(async function() {
        if (this.checked) {
            Proxy.updateSelectedProxyServer();
            Popup.indicateConnection();
            await Proxy.startSelectedProxy();
            await setIconAndBadge();
            Popup.disableToggles("#cmn-toggle-1");
        } else {
            Proxy.stopProxy();
            await setIconAndBadge();
            Popup.indicateDisconnect();
            await Popup.enableToggles();
        }
    });
}


Popup.monitorWebRTCSetting = function() {
    $("#cmn-toggle-2").change(async function() {
        if (this.checked) {
            Privacy.disableWebRTC();
        } else {
            await Privacy.enableWebRTC();
        }
    });
}


Popup.monitorSettingsView = function() {
    $("#settings_view").click(function() {
        Popup.showSettings();
    });

    $(".settings .content .glyphicon-menu-left").click(async function() {
        if (await Proxy.proxyAlwaysEnabled()) {
            await Proxy.startSelectedProxy();
        }
        Popup.showError();
        Popup.hideSettings();
    })
}

Popup.monitorLanguageSelect = function() {
    Popup.addLanguageSettingsViewListener();
    Popup.addBackToSettingsListener();
    Popup.addLanguageSelectListener();
}

Popup.addLanguageSettingsViewListener = function() {
    $("#language_settings_view").click(function() {
        Popup.showLanguageSettings();
    });
    $("#bypass_settings_view").click(function() {
        if (!$('#bypass_setting').hasClass('disabled')) {
            Popup.showBypassSettings();
        }
    });
}

Popup.addBackToSettingsListener = function() {
    $(".language_settings .content .glyphicon-menu-left").click(function() {
        Popup.hideLanguageSettings();
    })
    $(".bypass_settings .content .glyphicon-menu-left").click(function() {
        Popup.hideBypassSettings();
    })
}


Popup.addLanguageSelectListener = function() {
    $(".language_settings .content").click(function() {
        let locale = $(this).find(".key").attr("value"); // extracts locale info from clicked element
        chrome.i18n._resetL10nData();
        Localization.setLocale(locale);
        Localization.localizeHtmlPage();
        Popup.hideLanguageSettings();
    });
}




Popup.monitorEnableSocks = function() {
    $(Popup.enableSocksToggleID).change(async function() {
        if (await Proxy.autoFallbackIsSet()) {
            this.checked = false;
            return;
        }

        if (this.checked) {
            await Proxy.enableHidemeProxy();
            Popup.disableSingleToggle(Popup.automaticFallbackToggleID, Popup.disableSOCKSMessage);
        } else {
            Proxy.disableHidemeProxy();
            Popup.enableSingleToggle(Popup.automaticFallbackToggleID);
        }
    });
}


Popup.monitorAlwaysEnableProxy = function() {
    $("#cmn-toggle-4").change(async function() {
        if (this.checked) {
            /* Disable Proxy on/off switch */
            $("#cmn-toggle-1").prop("disabled", true);
            Proxy.setAlwaysEnableProxy();
            Popup.disableToggles("#cmn-toggle-4");
        } else {
            $("#cmn-toggle-1").prop("disabled", false);
            Proxy.unsetAlwaysEnableProxy();
            await Popup.enableToggles();
        }
        await Popup.restoreExtensionState();
    });
}


Popup.monitorAutomaticFallback = async function() {
    $(Popup.automaticFallbackToggleID).change(async function() {
        if (await Proxy.hidemeEnabled()) {
            this.checked = false;
            return;
        }

        if (this.checked) {
            /* Disable Proxy on/off switch */
            Proxy.enableAutomaticFallback();
            Popup.disableSingleToggle(Popup.enableSocksToggleID, Popup.disableAutomaticFallbackMessage);
        } else {
            Proxy.disableAutomaticFallback();
            Popup.enableSingleToggle(Popup.enableSocksToggleID);
        }
    });
}


Popup.monitorServerSelect = function() {
    Popup.addServerSelectListener();
    Popup.addServerListElementListener();
    Popup.addBackToMainListener();
}


Popup.addServerSelectListener = function() {
    $("#row_select_server").click(async function() {
        if (await Proxy.proxyConnected() || await Proxy.hidemeEnabled())
            return;
        await Servers.listServers();
        Popup.addServerListElementListener();
        Popup.showServerList();
    });
}


Popup.addServerListElementListener = function() {
    $(".servers_list li").click(async function() {
        var serverName = $(this).attr("name");
        console.log(serverName);
        Utils.clearErrorState();
        await Proxy.setSelectedServer(serverName);
        await Popup.showSelectedServer();
        Popup.hideServerList();
        Proxy.startProxyIfConnected();
        await Popup.showError()
    });
}


Popup.addBackToMainListener = function() {
    $(".servers_list .location .glyphicon-menu-left").click(function() {
        Popup.hideServerList();
    })
}


Popup.showServerList = function() {
    Popup.showView(".servers_list");
}


Popup.hideServerList = function() {
    Popup.hideView(".servers_list");
}


Popup.showSettings = function() {
    Popup.showView(".settings");
}


Popup.hideSettings = function() {
    Popup.hideView(".settings");
}

Popup.showLanguageSettings = function() {
    Popup.showViewWithPrev(".language_settings", ".settings")
}

Popup.hideLanguageSettings = function() {
    Popup.hideViewWithPrev(".language_settings", ".settings")
}

Popup.showBypassSettings = function() {
    Popup.showViewWithPrev(".bypass_settings", ".settings")
    Popup.monitorBypassSettings();
}

Popup.hideBypassSettings = function() {
    Popup.hideViewWithPrev(".bypass_settings", ".settings")
}

Popup.animationDuration = 100;
Popup.dialogContainerSelectors = [".servers_list", ".settings"];


Popup.showView = function(container_selector) {
    Popup.showViewWithPrev(container_selector, ".main")
}

Popup.showViewWithPrev = function(container_selector, prev_selector) {
    $(container_selector).css("height", "100%");
    $(prev_selector).css("left", "-258px");
    $(container_selector).css("left", "0px");
}

Popup.hideView = function(container_selector) {
    Popup.hideViewWithPrev(container_selector, ".main");
}

Popup.hideViewWithPrev = function(container_selector, prev_selector) {
    $(prev_selector).css("left", "0px");
    $(container_selector).css("left", "258px");
    setTimeout(function() {
        $(container_selector).css("height", "0%");
    }, 100);
}

Popup.monitorLinkClicks = function() {
    $("a").click(function(e) {
        var location = $(this).attr('href');
        chrome.tabs.create({ active: true, url: location });
    })
}


Popup.indicateConnection = function() {
    $(".connection_status").removeClass("disconnected").addClass("connected");
    $(".connection_status .indicator").html(Popup.connectedText);
}


Popup.indicateDisconnect = function() {
    $(".connection_status").removeClass("connected").addClass("disconnected");
    $(".connection_status .indicator").html(Popup.disconnectedText);
}


// Shows error if any, clear the popup from error reports otherwise.
Popup.showError = async function() {
    await Popup.restoreExtensionState();
    if (await Popup.showAndReportNotControllableError()) {
        return;
    }
    await Popup.showProxyOrWebRTCError();
    await Popup.noErrorCleanup();
}

// If extension is in not controllable state (either proxy or webrtc),
// shows not controllable error and indicates that error occured by returning 
// true. Otherwise indicates that no not controllable error occured by returning 
// false. 
Popup.showAndReportNotControllableError = async function() {
    /* This error condition is checked synchronously upon the loading 
       of  popup.html */
    if (await Proxy.inProxyNotControllableErrorState()) {
        /* show  proxy not controllable error view */
        await Popup.showNotControllable();
        return true;
    }

    const inWebRTCNotControllableErrorState = await Privacy.inWebRTCNotControllableErrorState();
    if (inWebRTCNotControllableErrorState) {
        $(Popup.notControllableAlert).show();
        return true;
    }

    return false;
}

// If extension is in proxy_error or webrtc_error, indicates this 
// in proxy connect toggle (main toggle).
Popup.showProxyOrWebRTCError = async function() {
    /* This error condition is set  asynchronously. */
    const inWebRTCErrorState = await Privacy.inWebRTCErrorState();
    const inProxyErrorState = await Proxy.inProxyErrorState();
    if (inProxyErrorState || inWebRTCErrorState) {
        // Popup.enableToggles()
        await Popup.addErrorStateToProxyToggle();
    }
}


// Clear the popup from error reporting if extension is not in error state
Popup.noErrorCleanup = async function() {
    if (await Utils.noError()) {
        await Popup.removeErrorStateFromProxyToggle();
        Popup.hideNotControllable();
    }
}

Popup.addErrorStateToProxyToggle = async function() {
    const errorMessage = await Utils.getStorage('_error_message');
    $("label.proxy_toggle").addClass("error");
    $("label.proxy_toggle").parent().attr("data-tooltip", errorMessage).addClass("tooltip-bottom tooltip-wide");
}


Popup.removeErrorStateFromProxyToggle = async function() {
    $("label.proxy_toggle").removeClass("error");
    $("label.proxy_toggle").parent().removeAttr("data-tooltip").
    removeClass("tooltip-wide tooltip-bottom");

    if (await Proxy.proxyAlwaysEnabled()) {
        $("label.proxy_toggle").parent().attr("data-tooltip", 'Disable Proxy to access this setting').addClass("tooltip-bottom");
    }
}


Popup.showNotControllable = async function() {
    const errorMessage = await Utils.getStorage('_error_message');
    $(".main .not_controllable .error_message").text(errorMessage);
    $(".main .content").hide();
    $(".main .not_controllable").show();
}

Popup.hideNotControllable = function() {
    /* Hides not controllable view if user fixes the error */
    if ($(".main .not_controllable").css('display') === 'block') {
        $(".main .content").show();
        $(".main .not_controllable").hide();
    }
}


Popup.monitorErrorButtons = function() {
    $(".extension_error .close_error").click(async function() {
        $(".extension_error").hide();
        await Popup.restoreExtensionState();
    });
}



// Number of toggles in our extension popup window
Popup.toggleCount = 5;
/* Iterates over all the toggle switches and disables them, except the one we indicate to skip. */
Popup.disableToggles = function(toggleToSkip) {
    Popup.disableSelectServer(Popup.disableProxyMesssage);
    let idTmpl = "#cmn-toggle-";
    for (let i = 1; i <= Popup.toggleCount; i++) {
        let id = idTmpl + i;
        if (id != toggleToSkip) {
            Popup.disableSingleToggle(id, Popup.disableProxyMesssage);
        }
    }
}

Popup.disableSingleToggle = function(id, message) {
    $(id).prop("disabled", true);
    $(id).parent().attr("data-tooltip", message)
        .addClass("tooltip-bottom");
    $(id + " + label").addClass("disabled");
}


Popup.enableSingleToggle = function(id) {
    $(id).prop("disabled", false);
    $(id).parent().removeAttr("data-tooltip").
    removeClass("tooltip-bottom");
    $(id + " + label").removeClass("disabled");
}

Popup.disableSelectServer = function(message) {
    $("#row_select_server").addClass("disabled").attr('data-tooltip', message);
    $("#bypass_setting").addClass("disabled tooltip-top").attr('data-tooltip', message);
}

Popup.enableSelectServer = function() {
    $("#row_select_server").removeClass("disabled").removeAttr('data-tooltip');
    $("#bypass_setting").removeClass("disabled tooltip-top").removeAttr('data-tooltip');
}


Popup.enableToggles = async function() {
    if (! await Proxy.proxyConnected()) {
        Popup.enableSelectServer();
    }

    let idTmpl = "#cmn-toggle-";
    for (let i = 1; i <= Popup.toggleCount; i++) {
        let id = idTmpl + i;
        Popup.enableSingleToggle(id);
    }
}


Popup.addFirefoxScrolling = function() {
    if (!Utils.isChrome()) {
        $('.main, .settings, .servers_list, .language_settings').bind('mousewheel', function(event) {
            event.preventDefault();
            var scrollTop = this.scrollTop;
            this.scrollTop = (scrollTop + ((event.deltaY * event.deltaFactor) * -1));
            //console.log(event.deltaY, event.deltaFactor, event.originalEvent.deltaMode, event.originalEvent.wheelDelta);
        });
    }
}

let port = chrome.runtime.connect({ name: "popup" });
chrome.runtime.onMessage.addListener(function(message, sender) {
    if (message.status === "error_update_popup") {
        Popup.showError();
        console.log("Error update received, popup");
    }
});

if ((typeof browser !== "undefined")) {
    var isAllowed = browser.extension.isAllowedIncognitoAccess();
    isAllowed.then(function(answer){
        if (!answer) {
            document.querySelector('.firefox-notification').classList.remove('hidden');
        }
    });
}