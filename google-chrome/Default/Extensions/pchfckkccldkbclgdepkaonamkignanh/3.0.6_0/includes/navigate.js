(function () {
    'use strict';

    /**
     * На страницах некоторых сервисов (например, "онбординг" дзена) может возникнуть необходимоть сделать редирект на ВЗ.
     * В таком случае скрипт на странице может вызвать window.dispatchEvent(new Event('vb-navigate'));
     * Мы в свою очередь слушаем это событие и прокидываем его в бэкграунд скрипт
     */
    window.addEventListener('vb-navigate', function () {
        chrome.runtime.sendMessage({action: 'vb-navigate'});
    });
})();
