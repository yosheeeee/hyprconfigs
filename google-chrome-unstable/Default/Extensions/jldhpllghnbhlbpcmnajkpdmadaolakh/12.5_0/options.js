import { browserApi } from './browserApi.js'
import { i18nUtils } from './i18nUtils.js'

// Saves options to chrome.storage
function save_options() {
    var withDueToday = document.getElementById('with_due_today').checked

    browserApi.setExtensionOptions(
        {
            withDueToday: withDueToday,
        },
        function () {
            // Update status to let user know options were saved.
            var status = document.getElementById('status')
            status.textContent = i18nUtils.getMessage('optionsSaved', 'Saved')
            setTimeout(function () {
                status.textContent = ''
            }, 750)
        },
    )
}

// Restores select box and checkbox state using the preferences
// stored in storage.
function restore_options() {
    i18nUtils.localizeHTML()

    browserApi.getExtensionOptions(function (items) {
        document.getElementById('with_due_today').checked = items.withDueToday

        document.getElementById('with_due_today').addEventListener('change', save_options)
    })
}

document.addEventListener('DOMContentLoaded', restore_options)
