(function () {
    'use strict';

    // отдаем referrer и другие данные статистике
    chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
        req = req || {};
        if (req.contentScriptAction === 'getBarnavigParams') {
            var data = {
                referer: document.referrer || null,
                yamm: req.isYandexHost ? getYamm() : null
            };

            // try..catch чтобы избежать script error line 0, возможный фикс VBCHROME-329
            try {
                sendResponse(data);
            } catch (e) {}

            /*
            getSpeedMetrics(function (speedData) {
                if (speedData) {
                    data.t = speedData;
                }

                // try..catch чтобы избежать script error line 0, возможный фикс VBCHROME-329
                try {
                    sendResponse(data);
                } catch(e) {}
            });
            return true;
            */
        }
    });

    function getYamm() {
        var metaNodes = document.getElementsByTagName('meta');
        for (var i = 0, len = metaNodes.length; i < len; i++) {
            var metaName = (metaNodes[i].name || '').toLowerCase();
            if (metaName == 'yamm' && metaNodes[i].content) {
                return String(metaNodes[i].content).substr(0, 10);
            }
        }
    }
})();
