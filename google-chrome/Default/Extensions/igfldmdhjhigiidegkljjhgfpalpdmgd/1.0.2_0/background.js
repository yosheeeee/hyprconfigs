var proxy = false;
chrome.runtime.onMessage.addListener(
    function (msg, sender, cb) {
        console.log(msg, sender, cb);
        switch(msg.action){
            case 'statusProxy':
                cb(proxy);
            break;
            case 'setProxy':
                proxy = msg.param.status;
                console.log('set status', msg.param.status);
            break;
        }
    }
);