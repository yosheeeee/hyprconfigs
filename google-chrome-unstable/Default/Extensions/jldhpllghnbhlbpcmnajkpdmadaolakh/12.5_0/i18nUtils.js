import { browserApi } from './browserApi.js'

var i18nUtils = {
    /*
     * localizeHTML() will iterate all DOM elements and
     * localize all elements who have special data tag 'data-message'
     * by replacing the textContent text with translated text
     * in the user's locale language.
     *
     * Example:
     * <h6 data-message="errorMsg">Error</h6>
     *
     * It no translation is available for a given message,
     * it will keep the element's original text
     */
    localizeHTML: function () {
        var elements = document.getElementsByTagName('*')
        for (var i = 0; i < elements.length; i++) {
            const elm = elements[i]
            if (elm.dataset && elm.dataset.message) {
                var msg = browserApi.getLocalizedMessage(elm.dataset.message)
                if (msg) {
                    elm.textContent = msg
                }
            }
        }
    },

    getMessage: function (messageName, defaultMessage) {
        return browserApi.getLocalizedMessage(messageName) || defaultMessage
    },
}

export { i18nUtils }
