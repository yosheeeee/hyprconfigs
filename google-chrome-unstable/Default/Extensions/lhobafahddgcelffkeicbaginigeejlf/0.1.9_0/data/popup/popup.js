var background = {
  "port": null,
  "message": {},
  "receive": function (id, callback) {
    if (id) {
      background.message[id] = callback;
    }
  },
  "send": function (id, data) {
    if (id) {
      chrome.runtime.sendMessage({
        "method": id,
        "data": data,
        "path": "popup-to-background"
      }, function () {
        return chrome.runtime.lastError;
      });
    }
  },
  "connect": function (port) {
    chrome.runtime.onMessage.addListener(background.listener); 
    /*  */
    if (port) {
      background.port = port;
      background.port.onMessage.addListener(background.listener);
      background.port.onDisconnect.addListener(function () {
        background.port = null;
      });
    }
  },
  "post": function (id, data) {
    if (id) {
      if (background.port) {
        background.port.postMessage({
          "method": id,
          "data": data,
          "path": "popup-to-background",
          "port": background.port.name
        });
      }
    }
  },
  "listener": function (e) {
    if (e) {
      for (let id in background.message) {
        if (background.message[id]) {
          if ((typeof background.message[id]) === "function") {
            if (e.path === "background-to-popup") {
              if (e.method === id) {
                background.message[id](e.data);
              }
            }
          }
        }
      }
    }
  }
};

var config = {
  "load": function () {
    const test = document.querySelector(".test");
    const reload = document.querySelector(".reload");
    const toggle = document.querySelector(".toggle");
    const support = document.querySelector(".support");
    const options = document.querySelector(".options");
    const explore = document.getElementById("explore");
    const donation = document.querySelector(".donation");
    const tutorial = document.querySelector(".tutorial");
    const whitelist = document.querySelector(".whitelist");
    /*  */
    test.addEventListener("click", function () {background.send("test")});
    reload.addEventListener("click", function () {background.send("reload")});
    toggle.addEventListener("click", function () {background.send("toggle")});
    support.addEventListener("click", function () {background.send("support")});
    options.addEventListener("click", function () {background.send("options")});
    tutorial.addEventListener("click", function () {background.send("tutorial")});
    donation.addEventListener("click", function () {background.send("donation")});
    whitelist.addEventListener("click", function () {background.send("whitelist")});
    /*  */
    background.send("load");
    window.removeEventListener("load", config.load, false);
    if (navigator.userAgent.indexOf("Edg") !== -1) explore.style.display = "none";
  },
  "render": function (e) {
    const toggle = document.querySelector(".toggle");
    const whitelist = document.querySelector(".whitelist");
    /*  */
    whitelist.removeAttribute("added");
    toggle.setAttribute("state", e.state);
    /*  */
    if (e) {
      if (e.tab) {
        if (e.tab.url) {
          if (e.tab.url.indexOf("http") === 0) {
            if (e.whitelist) {
              const hostname = (new URL(e.tab.url)).hostname;
              if (e.whitelist.indexOf(hostname) !== -1) {
                whitelist.setAttribute("added", true);
                return;
              }
            }
          }
        }
      }
    }
    /*  */
    whitelist.setAttribute("error", true);
    window.setTimeout(function () {
      whitelist.removeAttribute("error");
    }, 150);
  }
};

background.receive("storage", config.render);
window.addEventListener("load", config.load, false);
background.connect(chrome.runtime.connect({"name": "popup"}));
