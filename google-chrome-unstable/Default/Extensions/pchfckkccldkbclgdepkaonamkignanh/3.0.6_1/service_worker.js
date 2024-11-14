const justifications = {
    [chrome.offscreen.Reason.BLOBS]: 'Save blobs with Filesystem API using offscreen document',
    [chrome.offscreen.Reason.DOM_PARSER]: 'Parse xml documents using offscreen document',
    [chrome.offscreen.Reason.USER_MEDIA]: 'Interact with user media using offscreen document'
};

window = self;

// Run necessary scritps.
importScripts(
    'build-info.js',
    'brandings.js',
    'backend/bootstrap.js',
    'backend/bundle.js',
);
