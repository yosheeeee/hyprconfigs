function monitorLinkClicks() {
    $("a").click(function(event) {
        event.preventDefault();
        var location = $(this).attr('href');
        chrome.tabs.create({ active: true, url: location });
    })
}



document.addEventListener('DOMContentLoaded', async function() {
    await Localization.resetI18n(Localization.localizeHtmlPage);
    chrome.i18n._setL10nData();
    monitorLinkClicks();
});





chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
}, function(tabs) {
    var tab = tabs[0];
    var id = tab.id;

    chrome.tabs.create({ active: false, url: "https://www.youtube.com/", openerTabId: id }, setCreatedTabId);

});




function setCreatedTabId(newTab) {
    Utils.setStorage({'_created_tab_id': newTab.id});
}


chrome.runtime.onMessage.addListener(async function(message) {
    if (message.status != "_quic_info")
        return;

    const info = await Utils.getStorage('_quic_info');
    if (info.search('quic') === -1) {
        $('.privacy_quic').removeClass("privacy_not_ok").addClass("privacy_ok");
        $('.privacy_quic .desc').text(chrome.i18n.getMessage("quick_disabled_message"));
    }

    const webrtcDisabled = await Privacy.webRTCDisabled();
    if (!webrtcDisabled) {
        $('.privacy_webrtc').removeClass("privacy_ok").addClass("privacy_not_ok");
        $('.privacy_webrtc .desc').text(chrome.i18n.getMessage("webrtc_enabled_message"));
    }

    $(".privacy_state .row").show();
});


function emptyElement(myNode) {
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}