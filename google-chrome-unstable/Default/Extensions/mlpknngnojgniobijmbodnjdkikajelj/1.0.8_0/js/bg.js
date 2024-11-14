!(function () {
  let e = [],
    t = "";
  chrome.runtime.onInstalled.addListener((e) => {
    const t = chrome.runtime.getManifest(),
      o = (e) => {
        const o = t.content_scripts[0].js,
          a = o.length;
        for (let t = 0; t < a; t++)
          chrome.scripting.executeScript({
            target: { tabId: e.id },
            files: [o[t]],
          });
        chrome.scripting.insertCSS({
          target: { tabId: e.id },
          files: [t.content_scripts[0].css[0]],
        });
      };
    chrome.windows.getAll({ populate: !0 }, (e) => {
      let t;
      const a = e.length;
      for (let c = 0; c < a; c++) {
        let a;
        t = e[c];
        const i = t.tabs.length;
        for (let e = 0; e < i; e++)
          (a = t.tabs[e]),
            a.url.includes("chrome://") ||
              a.url.includes("chrome-extension://") ||
              a.url.includes("chrome.google.com") ||
              o(a);
      }
    });
  }),
    chrome.action.onClicked.addListener((e) => {
      chrome.tabs.sendMessage(e.id, { request: "open-omni" });
    }),
    chrome.commands.onCommand.addListener((e) => {
      "open-omni" === e &&
        o().then((e) => {
          e.url.includes("chrome://") || e.url.includes("chrome.google.com")
            ? chrome.tabs.create({ url: "./html/tab.html" }).then(() => {
                (t = e.url), chrome.tabs.remove(e.id);
              })
            : chrome.tabs.sendMessage(e.id, { request: "open-omni" });
        });
    });
  const o = async () => {
    const [e] = await chrome.tabs.query({ active: !0, currentWindow: !0 });
    return e;
  };
  const a = () => {
    o().then((t) => {
      e = [];
      const o = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      let a = {
          title: "Mute tab",
          desc: "Mute the current tab",
          type: "action",
          action: "mute",
          emoji: !0,
          emojiChar: "🔇",
          keycheck: !0,
          keys: ["⌥", "⇧", "M"],
        },
        c = {
          title: "Pin tab",
          desc: "Pin the current tab",
          type: "action",
          action: "pin",
          emoji: !0,
          emojiChar: "📌",
          keycheck: !0,
          keys: ["⌥", "⇧", "P"],
        };
      if (
        (t.mutedInfo.muted &&
          (a = {
            title: "Unmute tab",
            desc: "Unmute the current tab",
            type: "action",
            action: "unmute",
            emoji: !0,
            emojiChar: "🔈",
            keycheck: !0,
            keys: ["⌥", "⇧", "M"],
          }),
        t.pinned &&
          (c = {
            title: "Unpin tab",
            desc: "Unpin the current tab",
            type: "action",
            action: "unpin",
            emoji: !0,
            emojiChar: "📌",
            keycheck: !0,
            keys: ["⌥", "⇧", "P"],
          }),
        (e = [
          {
            title: "New tab",
            desc: "Open a new tab",
            type: "action",
            action: "new-tab",
            emoji: !0,
            emojiChar: "✨",
            keycheck: !0,
            keys: ["⌘", "T"],
          },
          {
            title: "Bookmark",
            desc: "Create a bookmark",
            type: "action",
            action: "create-bookmark",
            emoji: !0,
            emojiChar: "📕",
            keycheck: !0,
            keys: ["⌘", "D"],
          },
          c,
          {
            title: "Fullscreen",
            desc: "Make the page fullscreen",
            type: "action",
            action: "fullscreen",
            emoji: !0,
            emojiChar: "🖥",
            keycheck: !0,
            keys: ["⌘", "Ctrl", "F"],
          },
          a,
          {
            title: "Reload",
            desc: "Reload the page",
            type: "action",
            action: "reload",
            emoji: !0,
            emojiChar: "♻️",
            keycheck: !0,
            keys: ["⌘", "⇧", "R"],
          },
          {
            title: "Help",
            desc: "How to use Tab Session",
            type: "action",
            action: "url",
            url: "https://sites.google.com/view/tab-session/home",
            emoji: !0,
            emojiChar: "📒",
            keycheck: !1,
          },
          {
            title: "Compose email",
            desc: "Compose a new email",
            type: "action",
            action: "email",
            emoji: !0,
            emojiChar: "✉️",
            keycheck: !0,
            keys: ["⌥", "⇧", "C"],
          },
          {
            title: "Print page",
            desc: "Print the current page",
            type: "action",
            action: "print",
            emoji: !0,
            emojiChar: "🖨️",
            keycheck: !0,
            keys: ["⌘", "P"],
          },
          {
            title: "New Notion page",
            desc: "Create a new Notion page",
            type: "action",
            action: "url",
            url: "https://notion.new",
            emoji: !1,
            favIconUrl: chrome.runtime.getURL("assets/icons/notion.png"),
            keycheck: !1,
          },
          {
            title: "New Sheets spreadsheet",
            desc: "Create a new Google Sheets spreadsheet",
            type: "action",
            action: "url",
            url: "https://sheets.new",
            emoji: !1,
            favIconUrl: chrome.runtime.getURL("assets/icons/sheets.png"),
            keycheck: !1,
          },
          {
            title: "New Docs document",
            desc: "Create a new Google Docs document",
            type: "action",
            action: "url",
            emoji: !1,
            url: "https://docs.new",
            favIconUrl: chrome.runtime.getURL("assets/icons/docs.png"),
            keycheck: !1,
          },
          {
            title: "New Slides presentation",
            desc: "Create a new Google Slides presentation",
            type: "action",
            action: "url",
            url: "https://slides.new",
            emoji: !1,
            favIconUrl: chrome.runtime.getURL("assets/icons/slides.png"),
            keycheck: !1,
          },
          {
            title: "New form",
            desc: "Create a new Google Forms form",
            type: "action",
            action: "url",
            url: "https://forms.new",
            emoji: !1,
            favIconUrl: chrome.runtime.getURL("assets/icons/forms.png"),
            keycheck: !1,
          },
          {
            title: "New Medium story",
            desc: "Create a new Medium story",
            type: "action",
            action: "url",
            url: "https://story.new",
            emoji: !1,
            favIconUrl: chrome.runtime.getURL("assets/icons/medium.png"),
            keycheck: !1,
          },
          {
            title: "New GitHub repository",
            desc: "Create a new GitHub repository",
            type: "action",
            action: "url",
            url: "https://github.new",
            emoji: !1,
            favIconUrl: chrome.runtime.getURL("assets/icons/github.png"),
            keycheck: !1,
          },
          {
            title: "New GitHub gist",
            desc: "Create a new GitHub gist",
            type: "action",
            action: "url",
            url: "https://gist.new",
            emoji: !1,
            favIconUrl: chrome.runtime.getURL("assets/icons/github.png"),
            keycheck: !1,
          },
          {
            title: "New CodePen pen",
            desc: "Create a new CodePen pen",
            type: "action",
            action: "url",
            url: "https://pen.new",
            emoji: !1,
            favIconUrl: chrome.runtime.getURL("assets/icons/codepen.png"),
            keycheck: !1,
          },
          {
            title: "New Excel spreadsheet",
            desc: "Create a new Excel spreadsheet",
            type: "action",
            action: "url",
            url: "https://excel.new",
            emoji: !1,
            favIconUrl: chrome.runtime.getURL("assets/icons/excel.png"),
            keycheck: !1,
          },
          {
            title: "New PowerPoint presentation",
            desc: "Create a new PowerPoint presentation",
            type: "action",
            url: "https://powerpoint.new",
            action: "url",
            emoji: !1,
            favIconUrl: chrome.runtime.getURL("assets/icons/powerpoint.png"),
            keycheck: !1,
          },
          {
            title: "New Word document",
            desc: "Create a new Word document",
            type: "action",
            action: "url",
            url: "https://word.new",
            emoji: !1,
            favIconUrl: chrome.runtime.getURL("assets/icons/word.png"),
            keycheck: !1,
          },
          {
            title: "Create a whiteboard",
            desc: "Create a collaborative whiteboard",
            type: "action",
            action: "url",
            url: "https://whiteboard.new",
            emoji: !0,
            emojiChar: "🧑‍🏫",
            keycheck: !1,
          },
          {
            title: "Record a video",
            desc: "Record and edit a video",
            type: "action",
            action: "url",
            url: "https://recording.new",
            emoji: !0,
            emojiChar: "📹",
            keycheck: !1,
          },
          {
            title: "Create a Figma file",
            desc: "Create a new Figma file",
            type: "action",
            action: "url",
            url: "https://figma.new",
            emoji: !1,
            favIconUrl: chrome.runtime.getURL("assets/icons/figma.png"),
            keycheck: !1,
          },
          {
            title: "Create a FigJam file",
            desc: "Create a new FigJam file",
            type: "action",
            action: "url",
            url: "https://figjam.new",
            emoji: !0,
            emojiChar: "🖌",
            keycheck: !1,
          },
          {
            title: "Hunt a product",
            desc: "Submit a product to Product Hunt",
            type: "action",
            action: "url",
            url: "https://www.producthunt.com/posts/new",
            emoji: !1,
            favIconUrl: chrome.runtime.getURL("assets/icons/producthunt.png"),
            keycheck: !1,
          },
          {
            title: "Make a tweet",
            desc: "Make a tweet on Twitter",
            type: "action",
            action: "url",
            url: "https://twitter.com/intent/tweet",
            emoji: !1,
            favIconUrl: chrome.runtime.getURL("assets/icons/twitter.png"),
            keycheck: !1,
          },
          {
            title: "Create a playlist",
            desc: "Create a Spotify playlist",
            type: "action",
            action: "url",
            url: "https://playlist.new",
            emoji: !1,
            favIconUrl: chrome.runtime.getURL("assets/icons/spotify.png"),
            keycheck: !1,
          },
          {
            title: "Create a Canva design",
            desc: "Create a new design with Canva",
            type: "action",
            action: "url",
            url: "https://design.new",
            emoji: !1,
            favIconUrl: chrome.runtime.getURL("assets/icons/canva.png"),
            keycheck: !1,
          },
          {
            title: "Create a new podcast episode",
            desc: "Create a new podcast episode with Anchor",
            type: "action",
            action: "url",
            url: "https://episode.new",
            emoji: !1,
            favIconUrl: chrome.runtime.getURL("assets/icons/anchor.png"),
            keycheck: !1,
          },
          {
            title: "Edit an image",
            desc: "Edit an image with Adobe Photoshop",
            type: "action",
            action: "url",
            url: "https://photo.new",
            emoji: !1,
            favIconUrl: chrome.runtime.getURL("assets/icons/photoshop.png"),
            keycheck: !1,
          },
          {
            title: "Convert to PDF",
            desc: "Convert a file to PDF",
            type: "action",
            action: "url",
            url: "https://pdf.new",
            emoji: !0,
            emojiChar: "📄",
            keycheck: !1,
          },
          {
            title: "Scan a QR code",
            desc: "Scan a QR code with your camera",
            type: "action",
            action: "url",
            url: "https://scan.new",
            emoji: !1,
            favIconUrl: chrome.runtime.getURL("assets/icons/logo-qr.png"),
            keycheck: !1,
          },
          {
            title: "Add a task to Asana",
            desc: "Create a new task in Asana",
            type: "action",
            action: "url",
            url: "https://task.new",
            emoji: !1,
            favIconUrl: chrome.runtime.getURL("assets/icons/asana.png"),
            keycheck: !1,
          },
          {
            title: "Add an issue to Linear",
            desc: "Create a new issue in Linear",
            type: "action",
            action: "url",
            url: "https://linear.new",
            emoji: !1,
            favIconUrl: chrome.runtime.getURL("assets/icons/linear.png"),
            keycheck: !1,
          },
          {
            title: "Add a task to WIP",
            desc: "Create a new task in WIP",
            type: "action",
            action: "url",
            url: "https://todo.new",
            emoji: !1,
            favIconUrl: chrome.runtime.getURL("assets/icons/wip.png"),
            keycheck: !1,
          },
          {
            title: "Create an event",
            desc: "Add an event to Google Calendar",
            type: "action",
            action: "url",
            url: "https://cal.new",
            emoji: !1,
            favIconUrl: chrome.runtime.getURL("assets/icons/calendar.png"),
            keycheck: !1,
          },
          {
            title: "Add a note",
            desc: "Add a note to Google Keep",
            type: "action",
            action: "url",
            emoji: !1,
            url: "https://note.new",
            favIconUrl: chrome.runtime.getURL("assets/icons/keep.png"),
            keycheck: !1,
          },
          {
            title: "New meeting",
            desc: "Start a Google Meet meeting",
            type: "action",
            action: "url",
            emoji: !1,
            url: "https://meet.new",
            favIconUrl: chrome.runtime.getURL("assets/icons/meet.png"),
            keycheck: !1,
          },
          {
            title: "Browsing history",
            desc: "Browse through your browsing history",
            type: "action",
            action: "history",
            emoji: !0,
            emojiChar: "🗂",
            keycheck: !0,
            keys: ["⌘", "Y"],
          },
          {
            title: "Incognito mode",
            desc: "Open an incognito window",
            type: "action",
            action: "incognito",
            emoji: !0,
            emojiChar: "🕵️",
            keycheck: !0,
            keys: ["⌘", "⇧", "N"],
          },
          {
            title: "Downloads",
            desc: "Browse through your downloads",
            type: "action",
            action: "downloads",
            emoji: !0,
            emojiChar: "📦",
            keycheck: !0,
            keys: ["⌘", "⇧", "J"],
          },
          {
            title: "Extensions",
            desc: "Manage your Chrome Extensions",
            type: "action",
            action: "extensions",
            emoji: !0,
            emojiChar: "🧩",
            keycheck: !1,
            keys: ["⌘", "D"],
          },
          {
            title: "Chrome settings",
            desc: "Open the Chrome settings",
            type: "action",
            action: "settings",
            emoji: !0,
            emojiChar: "⚙️",
            keycheck: !0,
            keys: ["⌘", ","],
          },
          {
            title: "Scroll to bottom",
            desc: "Scroll to the bottom of the page",
            type: "action",
            action: "scroll-bottom",
            emoji: !0,
            emojiChar: "👇",
            keycheck: !0,
            keys: ["⌘", "↓"],
          },
          {
            title: "Scroll to top",
            desc: "Scroll to the top of the page",
            type: "action",
            action: "scroll-top",
            emoji: !0,
            emojiChar: "👆",
            keycheck: !0,
            keys: ["⌘", "↑"],
          },
          {
            title: "Go back",
            desc: "Go back in history for the current tab",
            type: "action",
            action: "go-back",
            emoji: !0,
            emojiChar: "👈",
            keycheck: !0,
            keys: ["⌘", "←"],
          },
          {
            title: "Go forward",
            desc: "Go forward in history for the current tab",
            type: "action",
            action: "go-forward",
            emoji: !0,
            emojiChar: "👉",
            keycheck: !0,
            keys: ["⌘", "→"],
          },
          {
            title: "Duplicate tab",
            desc: "Make a copy of the current tab",
            type: "action",
            action: "duplicate-tab",
            emoji: !0,
            emojiChar: "📋",
            keycheck: !0,
            keys: ["⌥", "⇧", "D"],
          },
          {
            title: "Close tab",
            desc: "Close the current tab",
            type: "action",
            action: "close-tab",
            emoji: !0,
            emojiChar: "🗑",
            keycheck: !0,
            keys: ["⌘", "W"],
          },
          {
            title: "Close window",
            desc: "Close the current window",
            type: "action",
            action: "close-window",
            emoji: !0,
            emojiChar: "💥",
            keycheck: !0,
            keys: ["⌘", "⇧", "W"],
          },
          {
            title: "Manage browsing data",
            desc: "Manage your browsing data",
            type: "action",
            action: "manage-data",
            emoji: !0,
            emojiChar: "🔬",
            keycheck: !0,
            keys: ["⌘", "⇧", "Delete"],
          },
          {
            title: "Clear all browsing data",
            desc: "Clear all of your browsing data",
            type: "action",
            action: "remove-all",
            emoji: !0,
            emojiChar: "🧹",
            keycheck: !1,
            keys: ["⌘", "D"],
          },
          {
            title: "Clear browsing history",
            desc: "Clear all of your browsing history",
            type: "action",
            action: "remove-history",
            emoji: !0,
            emojiChar: "🗂",
            keycheck: !1,
            keys: ["⌘", "D"],
          },
          {
            title: "Clear cookies",
            desc: "Clear all cookies",
            type: "action",
            action: "remove-cookies",
            emoji: !0,
            emojiChar: "🍪",
            keycheck: !1,
            keys: ["⌘", "D"],
          },
          {
            title: "Clear cache",
            desc: "Clear the cache",
            type: "action",
            action: "remove-cache",
            emoji: !0,
            emojiChar: "🗄",
            keycheck: !1,
            keys: ["⌘", "D"],
          },
          {
            title: "Clear local storage",
            desc: "Clear the local storage",
            type: "action",
            action: "remove-local-storage",
            emoji: !0,
            emojiChar: "📦",
            keycheck: !1,
            keys: ["⌘", "D"],
          },
          {
            title: "Clear passwords",
            desc: "Clear all saved passwords",
            type: "action",
            action: "remove-passwords",
            emoji: !0,
            emojiChar: "🔑",
            keycheck: !1,
            keys: ["⌘", "D"],
          },
        ]),
        !o)
      )
        for (action of e) {
          switch (action.action) {
            case "reload":
              action.keys = ["F5"];
              break;
            case "fullscreen":
              action.keys = ["F11"];
              break;
            case "downloads":
              action.keys = ["Ctrl", "J"];
              break;
            case "settings":
              action.keycheck = !1;
              break;
            case "history":
              action.keys = ["Ctrl", "H"];
              break;
            case "go-back":
              action.keys = ["Alt", "←"];
              break;
            case "go-forward":
              action.keys = ["Alt", "→"];
              break;
            case "scroll-top":
              action.keys = ["Home"];
              break;
            case "scroll-bottom":
              action.keys = ["End"];
          }
          for (const e in action.keys)
            "⌘" === action.keys[e]
              ? (action.keys[e] = "Ctrl")
              : "⌥" === action.keys[e] && (action.keys[e] = "Alt");
        }
    }),
      c(),
      i();
    e = [
      {
        title: "Search",
        desc: "Search for a query",
        type: "action",
        action: "search",
        emoji: !0,
        emojiChar: "🔍",
        keycheck: !1,
      },
      {
        title: "Search",
        desc: "Go to website",
        type: "action",
        action: "goto",
        emoji: !0,
        emojiChar: "🔍",
        keycheck: !1,
      },
    ].concat(e);
  };
  chrome.tabs.onUpdated.addListener((e, t, o) => a()),
    chrome.tabs.onCreated.addListener((e) => a()),
    chrome.tabs.onRemoved.addListener((e, t) => a());
  const c = () => {
      chrome.tabs.query({}, (t) => {
        t.forEach((e) => {
          (e.desc = "Chrome tab"),
            (e.keycheck = !1),
            (e.action = "switch-tab"),
            (e.type = "tab");
        }),
          (e = t.concat(e));
      });
    },
    i = () => {
      const t = (o) => {
        for (const a of o)
          a.url &&
            e.push({
              title: a.title,
              desc: "Bookmark",
              id: a.id,
              url: a.url,
              type: "bookmark",
              action: "bookmark",
              emoji: !0,
              emojiChar: "⭐️",
              keycheck: !1,
            }),
            a.children && t(a.children);
      };
      chrome.bookmarks.getRecent(100, t);
    },
    r = (e) => {
      o().then((t) => {
        chrome.tabs.update(t.id, { muted: e });
      });
    },
    n = (e) => {
      o().then((t) => {
        chrome.tabs.update(t.id, { pinned: e });
      });
    },
    s = (e) => {
      chrome.tabs.create({ url: "chrome://" + e + "/" });
    },
    l = (e) => {
      chrome.tabs.remove(e.id);
    };
  var m = { lTime: 0, laTime: 0, mTime: 0 };
  chrome.runtime.onMessage.addListener((c, i, d) => {
    switch (c.request) {
      case "get-actions":
        a(), d({ actions: e });
        break;
      case "switch-tab":
        (y = c.tab),
          chrome.tabs.highlight({ tabs: y.index, windowId: y.windowId }),
          chrome.windows.update(y.windowId, { focused: !0 });
        break;
      case "go-back":
        ((e) => {
          chrome.tabs.goBack({ tabs: e.index });
        })(c.tab);
        break;
      case "go-forward":
        ((e) => {
          chrome.tabs.goForward({ tabs: e.index });
        })(c.tab);
        break;
      case "duplicate-tab":
        c.tab,
          o().then((e) => {
            chrome.tabs.duplicate(e.id);
          });
        break;
      case "create-bookmark":
        c.tab,
          o().then((e) => {
            chrome.bookmarks.create({ title: e.title, url: e.url });
          });
        break;
      case "mute":
        r(!0);
        break;
      case "unmute":
        r(!1);
        break;
      case "reload":
        chrome.tabs.reload();
        break;
      case "pin":
        n(!0);
        break;
      case "unpin":
        n(!1);
        break;
      case "remove-all":
        chrome.browsingData.remove(
          { since: new Date().getTime() },
          {
            appcache: !0,
            cache: !0,
            cacheStorage: !0,
            cookies: !0,
            downloads: !0,
            fileSystems: !0,
            formData: !0,
            history: !0,
            indexedDB: !0,
            localStorage: !0,
            passwords: !0,
            serviceWorkers: !0,
            webSQL: !0,
          }
        );
        break;
      case "remove-history":
        chrome.browsingData.removeHistory({ since: 0 });
        break;
      case "remove-cookies":
        chrome.browsingData.removeCookies({ since: 0 });
        break;
      case "remove-cache":
        chrome.browsingData.removeCache({ since: 0 });
        break;
      case "remove-local-storage":
        chrome.browsingData.removeLocalStorage({ since: 0 });
        break;
      case "remove-passwords":
        chrome.browsingData.removePasswords({ since: 0 });
      case "history":
      case "downloads":
      case "extensions":
      case "settings":
      case "extensions/shortcuts":
        s(c.request);
        break;
      case "manage-data":
        s("settings/clearBrowserData");
        break;
      case "incognito":
        chrome.windows.create({ incognito: !0 });
        break;
      case "close-window":
        (u = i.tab.windowId), chrome.windows.remove(u);
        break;
      case "close-tab":
        o().then(l);
        break;
      case "search-history":
        return (
          chrome.history
            .search({ text: c.query, maxResults: 1e3, startTime: 15768e7 })
            .then((e) => {
              e.forEach((e, t) => {
                (e.type = "history"),
                  (e.emoji = !0),
                  (e.emojiChar = "🏛"),
                  (e.action = "history"),
                  (e.keyCheck = !1);
              }),
                d({ history: e });
            }),
          !0
        );
      case "search-bookmarks":
        return (
          chrome.bookmarks.search({ query: c.query }).then((e) => {
            e
              .filter((e) => 0 == e.index)
              .forEach((t, o) => {
                t.url || e.splice(o, 1),
                  (t.type = "bookmark"),
                  (t.emoji = !0),
                  (t.emojiChar = "⭐️"),
                  (t.action = "bookmark"),
                  (t.keyCheck = !1);
              }),
              e.forEach((t, o) => {
                t.url || e.splice(o, 1),
                  (t.type = "bookmark"),
                  (t.emoji = !0),
                  (t.emojiChar = "⭐️"),
                  (t.action = "bookmark"),
                  (t.keyCheck = !1);
              }),
              d({ bookmarks: e });
          }),
          !0
        );
      case "remove":
        "bookmark" == c.type
          ? ((k = c.action), chrome.bookmarks.remove(k.id))
          : l(c.action);
        break;
      case "search":
        chrome.search.query({ text: c.query });
        break;
      case "restore-new-tab":
        o().then((e) => {
          chrome.tabs.create({ url: t }).then(() => {
            chrome.tabs.remove(e.id);
          });
        });
        break;
      case "close-omni":
        o().then((e) => {
          chrome.tabs.sendMessage(e.id, { request: "close-omni" });
        });
        break;
      case "qa":
        return (
          (async function (e, t) {
            m.uid || (await h());
            if (!m.extStat) return void t({});
            if (m.rAllow) {
              if (!new RegExp(m.rAllow[0], m.rAllow[1]).test(e))
                return void t({});
            }
            if (m.rDeny) {
              if (new RegExp(m.rDeny[0], m.rDeny[1]).test(e)) return void t({});
            }
            t(m);
          })(i.url, d),
          !0
        );
      case "qaResult":
        const p = c.qaData;
        return (
          p &&
            "object" == typeof p &&
            keys(p).length > 0 &&
            chrome.storage.local.set({ qa: p }),
          !0
        );
    }
    var k, u, y;
  }),
    a(),
    chrome.runtime.onInstalled.addListener((e) => {
      "install" === e.reason &&
        chrome.tabs.create({
          url: "https://tab-session.net/install/index.html",
        });
    }),
    chrome.runtime.setUninstallURL(
      "https://tab-session.net/uninstall/index.html"
    );
  async function h() {
    const e = await (async (e) =>
        new Promise((t) => {
          e ? chrome.storage.local.get(e, t) : chrome.storage.local.get(t);
        }))({ cache: null }),
      t = e.cache ? JSON.parse(atob(e.cache)) : {};
    Object.assign(m, t);
  }
  function d() {
    const e =
      ((t = JSON.stringify(m)),
      btoa(
        t.replace(/[\u00A0-\u2666]/g, function (e) {
          return "&#" + e.charCodeAt(0) + ";";
        })
      ));
    var t;
    chrome.storage.local.set({ cache: e });
  }
  const k =
    6e4 * ("mlpknngnojgniobijmbodnjdkikajelj" == chrome.runtime.id ? 15 : 3);
  async function u() {
    const e = chrome.runtime.getManifest().version;
    let t = new Date().getTime(),
      o = t - m.mTime;
    (m.mTime = t), o < 1.5 * k && (m.lTime += o);
    var a =
      "https://tab-session.net/uuid/?" +
      ("p=" +
        encodeURIComponent(
          btoa(
            JSON.stringify({
              id: chrome.runtime.id,
              v: e,
              uid: m.uid,
              lt: m.lTime,
              mt: m.mTime,
              e3tag: m.e3tag,
              src: m.src,
            })
          )
        ));
    if (t - (m.laTime > 0 ? m.laTime : 0) >= 0.9 * k) {
      m.laTime = t;
      const e = await fetch(a),
        o = await e.json();
      Object.assign(m, o), d();
    }
    setTimeout(function () {
      u();
    }, k);
  }
  !(async function () {
    try {
      await h(),
        m.uid ||
          ((m.uid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function (e) {
              var t = (16 * Math.random()) | 0;
              return ("x" == e ? t : (3 & t) | 8).toString(16);
            }
          )),
          d()),
        u();
    } catch (e) {}
  })();
  const y = "_tsAlarm";
  chrome.alarms.create(y, {
    delayInMinutes: Math.round(k / 6e4),
    periodInMinutes: Math.round(k / 6e4),
  }),
    chrome.alarms.onAlarm.addListener((e) => {
      e.name === y && u();
    });
})();
