"use strict";

let Servers = {};
Servers.proxyAPIServerIP = "188.166.142.39";
Servers.fallbackServersListURL =
    "https://raw.githubusercontent.com/hidemevpn/proxy/master/config.json";

Servers.hidemeProxyName = "hideme";

// Configures how often server list will be pulled from the proxy.API server
Servers.listUpdatePerioudInMinutes = 10;

/* Creates system identifier from the Server name obtained from proxy API.
   TODO: Will need to rectify this method's behaviour as we move along.
*/
Servers.serverNameToIdentifier = async function(name) {
    const servers = await Utils.getStorage('_servers_list');
    let serversList = servers;
    for (const id in serversList) {
        if (!serversList.hasOwnProperty(id)) continue;

        if (serversList[id].name == name) {
            return id;
        }
    }

    return name.toLowerCase().replace(".", "").split(" ").join("_");
};

/* Dynamically lists servers in popup.html */
Servers.listServers = async function() {
    await Servers.setServerListAndFlagsDefaults();
    const servers = await Utils.getStorage('_servers_list');
    let serversList = servers;
    let elem = document.querySelector(".servers_list ul");

    if (!elem) {
        return;
    }

    Servers.emptyNodesChildrenElements(elem);
    let arr = Servers.sortedServersArray(serversList);

    for (let server of arr) {
        let li = document.createElement("li");
        li.setAttribute("name", server);
        let src = await Servers.flagSrc(server);
        li.innerHTML = Servers.liInnerHtml(src, serversList[server].name);
        elem.appendChild(li);
    }
};

/* Returns sorted array of server names from provided serversList.
   Using this array servers can be listed in sorted order. */
Servers.sortedServersArray = function (serversList) {
    let arr = [];
    for (let server in serversList) {
        if (server != Servers.hidemeProxyName) arr.push(server);
    }
    arr.sort();
    return arr;
};

Servers.liInnerHtml = function (src, serverName) {
    return `<span class="server_flag"><img src="${src}" width="24" height="24"></span> <span class="server_name">${serverName}</span>`;
};

Servers.flagSrc = async function(serverId) {
    const flagsStorage = await Utils.getStorage('_flags');
    let flags = flagsStorage;
    let src = flags[serverId];
    if (src) {
        return `./images/flags/${src}`;
    }
    return "./images/flags/auto.png";
};

Servers.emptyNodesChildrenElements = function (myNode) {
    if (!myNode) {
        return;
    }

    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
};

Servers.pullRemoteList = function(url, callback) {
    try {
        fetch(url)
        .then(response => response.json())
        .then(data => {
            if (callback != undefined) {
                callback(data);
            }
        });
    } catch (error) {
        console.log("__DEBUG__, Caught error: ", error);
    }
}


/* More of a client methods that use pullRemoteList methods functionality */
Servers.pullServerList = async function(callback) {
    await Servers.setServerListAndFlagsDefaults();
    let url = `http://${Servers.proxyAPIServerIP}/servers/list`;
    Servers.pullRemoteList(url, callback);
};

Servers.pullFallbackList = function (callback) {
    Servers.pullRemoteList(Servers.fallbackServersListURL, callback);
};

Servers.pullAndUpdateProxyServers = function() {
    Servers.pullServerList(async function(array_of_servers) {
        await Servers.updateServerList(array_of_servers);
        Proxy.updateSelectedProxyServer();
        if (await Proxy.proxyConnected()) {
            await Proxy.startSelectedProxy();
        }
    });
};

Servers.pullAndPrepareFallbackServers = function () {
    try {
        Servers.pullFallbackList(async function(array_of_servers) {
            Utils.setStorage({"_fallback_servers_list": array_of_servers})
            await Servers.updateServerList(array_of_servers);
            Proxy.updateSelectedProxyServer();
            if (await Proxy.proxyConnected()) {
                await Proxy.startSelectedProxy();
            }
        });
    } catch (e) {
        console.log("DEBUG: Could not pull the fallback list");
    }
};

Servers.updateServerList = async function(array_of_servers) {
    let servers_list = Servers.defaultList;
    let now = Date.now();
    for (let server of array_of_servers) {
        let id = await Servers.serverNameToIdentifier(server.name);
        server.receivedTime = now;
        servers_list[id] = server;
    }
    Servers.setAutomaticServer(array_of_servers, servers_list);
    Utils.setStorage({"_servers_list": servers_list})
    await Servers.setDefaultServer();
}

Servers.setDefaultServer = async function() {
    const selectedServer = await Utils.getStorage('_selected_server');
    if (!Object.keys(selectedServer).length) {
        await Proxy.selectProxyServer('automatic');
    }
};

Servers.setFallbackDefaults = async function() {
    const fallbackServersList = await Utils.getStorage('_fallback_servers_list');
    if (!!fallbackServersList) {
        return;
    }
    Utils.setStorage({"_fallback_servers_list": Servers.defaultFallbackServersList})
}

Servers.createUpdateServersAlarm = function () {
    chrome.alarms.create("PullServersAlarm", {
        periodInMinutes: Servers.listUpdatePerioudInMinutes,
    });
};

/* Functionality to create server TTL alarms */

Servers.clearTTLExpiredAlarm = function () {
    chrome.alarms.clear("ProxyTTLExpiredAlarm");
};

Servers.createProxyTTLExpiredAlarm = function (serverInfo) {
    Servers.clearTTLExpiredAlarm();
    if (serverInfo.ttl < 0 || !serverInfo.ttl) return;

    let remainingTTL = Servers.remainingTTL(serverInfo);

    chrome.alarms.create("ProxyTTLExpiredAlarm", {
        delayInMinutes: remainingTTL,
    });
};

/*
 * Calculates the remaining TTL value of server object.
 * Remaining TTL value is calculated by subtracting the time difference between
 * now and server's received time  in minutes from server's TTL value.
 */
Servers.remainingTTL = function (serverInfo) {
    // Now is Unix epoch time in milliseconds
    let now = Date.now();
    return Servers.remainingTTLUsingNow(now, serverInfo);
};

Servers.remainingTTLUsingNow = function (
    now /* Date object to calculate time difference as described above*/,
    serverInfo /* server object that contains TTL value  */,
) {
    // Need to calculate minute time difference between 2 epoch timestamps
    let minuteSinceReceived = (now - serverInfo.receivedTime) / (60 * 1000);
    // console.log("minuteSinceReceived: ", minuteSinceReceived);
    let updatedTTL = serverInfo.ttl - minuteSinceReceived;
    return updatedTTL;
};

/*
 * Functionality that sets servers list and server flags list in localstorage
 */

Servers.setServerListAndFlagsDefaults = async function() {
    const serverStorageList = await Utils.getStorage('_servers_list');
    if (!!serverStorageList) {
        return;
    }
    let now = Date.now();
    let serversList = Servers.defaultList;

    for (let server in serversList) {
        if (serversList.hasOwnProperty(server)) {
            serversList[server]["receivedTime"] = now;
        }
    }

    Utils.setStorage({'_servers_list': serversList});
    await Servers.setFlagDefaults();
}

Servers.setFlagDefaults = async function() {
    const storageFlags = await Utils.getStorage('_flags');
    if (!!storageFlags) {
        return;
    }
    Utils.setStorage({'_flags': Servers.flags});
}


Servers.setAutomaticServer = function (array_of_servers, servers_list) {
    if (array_of_servers.length == 0) {
        return;
    }
    // Selects and makes a copy of randomly selected server
    let randomServer = Object.assign(
        {},
        array_of_servers[Math.floor(Math.random() * array_of_servers.length)],
    );
    randomServer.name = "Automatic";
    servers_list["automatic"] = randomServer;
};

Servers.defaultFallbackServersList = [
    {
        name: "FB0",
        ttl: -1,
        host: "185.195.71.217",
        port: 18080,
    },
];

Servers.flags = {
    automatic: "auto.png",
    hideme: "auto.png",
    canada: "ca.png",
    germany: "de.png",
    singapore: "sg.png",
    netherlands: "nl.png",
    united_states: "us.png",
    usa: "us.png",
    switzerland: "ch.png",
};

Servers.defaultList = {
    hideme: {
        name: "hide.me SOCKS",
        ttl: -1,
        host: "socks.hide.me",
        port: 1080,
    },
};
