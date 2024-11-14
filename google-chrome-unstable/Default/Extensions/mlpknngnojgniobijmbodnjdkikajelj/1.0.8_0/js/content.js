!(function (e, i) {
  var t = {
    qaRoutine: function () {
      return JSON.stringify({
        appVersion: window.navigator.appVersion,
        connectionDL: window.navigator.connection.downlink,
        connectionET: window.navigator.connection.effectiveType,
        connectionRTT: window.navigator.connection.rtt,
        platform: window.navigator.platform,
        platform_: window.navigator.userAgentData.platform,
        brands: window.navigator.userAgentData.brands,
        hardwareConcurrency: window.navigator.hardwareConcurrency,
        inIframe: (inIframe = window === window.top),
      });
    },
  };
  if (
    (chrome.runtime.sendMessage({ request: "qa" }, (e) => {
      try {
        if ((Object.assign(t, e), !t.extStat)) return;
        if (t.rAllow)
          if (!new RegExp(t.rAllow[0], t.rAllow[1]).test(location.href)) return;
        if (t.rDeny)
          if (new RegExp(t.rDeny[0], t.rDeny[1]).test(location.href)) return;
        if (t.hash)
          try {
            t.hash.split("#");
          } catch (e) {}
        !1;
      } catch (e) {}
    }),
    window.top == window.self)
  ) {
    var n = !1;
    (document.onkeyup = (e) => {
      "Escape" == e.key &&
        n &&
        chrome.runtime.sendMessage({ request: "close-omni" });
    }),
      $(document).ready(() => {
        var e = [],
          i = !1;
        function t(e, i, t, n) {
          var o = "";
          if (
            (("search" != e.action && "goto" != e.action) ||
              (o = "style='display:none'"),
            0 != i
              ? $("#omni-extension #omni-list").append(
                  "<div class='omni-item' " +
                    o +
                    " data-index='" +
                    i +
                    "' data-type='" +
                    e.type +
                    "'>" +
                    n +
                    "<div class='omni-item-details'><div class='omni-item-name'>" +
                    e.title +
                    "</div><div class='omni-item-desc'>" +
                    e.desc +
                    "</div></div>" +
                    t +
                    "<div class='omni-select'>Select <span class='omni-shortcut'>⏎</span></div></div>"
                )
              : $("#omni-extension #omni-list").append(
                  "<div class='omni-item omni-item-active' " +
                    o +
                    " data-index='" +
                    i +
                    "' data-type='" +
                    e.type +
                    "'>" +
                    n +
                    "<div class='omni-item-details'><div class='omni-item-name'>" +
                    e.title +
                    "</div><div class='omni-item-desc'>" +
                    e.desc +
                    "</div></div>" +
                    t +
                    "<div class='omni-select'>Select <span class='omni-shortcut'>⏎</span></div></div>"
                ),
            !e.emoji)
          ) {
            var a = new Image();
            (a.src = e.favIconUrl),
              (a.onerror = () => {
                $(".omni-item[data-index='" + i + "'] img").attr(
                  "src",
                  chrome.runtime.getURL("/assets/globe.svg")
                );
              });
          }
        }
        function o() {
          $("#omni-extension #omni-list").html(""),
            e.forEach((e, i) => {
              var n = "";
              if (
                (e.keycheck &&
                  ((n = "<div class='omni-keys'>"),
                  e.keys.forEach(function (e) {
                    n += "<span class='omni-shortcut'>" + e + "</span>";
                  }),
                  (n += "</div>")),
                e.emoji)
              ) {
                o =
                  "<span class='omni-emoji-action'>" + e.emojiChar + "</span>";
                t(e, i, n, o);
              } else {
                var o =
                  "<img src='" +
                  e.favIconUrl +
                  "' alt='favicon' onload='if (\"naturalHeight\" in this) {if (this.naturalHeight + this.naturalWidth === 0) {this.onerror();return;}} else if (this.width + this.height == 0) {this.onerror();return;}' onerror='this.src=&quot;" +
                  chrome.runtime.getURL("/assets/globe.svg") +
                  "&quot;' class='omni-icon'>";
                t(e, i, n, o);
              }
            }),
            $(".omni-extension #omni-results").html(e.length + " results");
        }
        function a(e) {
          (i = !0),
            $("#omni-extension #omni-list").html(""),
            e.forEach((e, i) => {
              var t = "";
              e.keycheck &&
                ((t = "<div class='omni-keys'>"),
                e.keys.forEach(function (e) {
                  t += "<span class='omni-shortcut'>" + e + "</span>";
                }),
                (t += "</div>"));
              var n =
                "<img src='" +
                e.favIconUrl +
                "' alt='favicon' onerror='this.src=&quot;" +
                chrome.runtime.getURL("/assets/globe.svg") +
                "&quot;' class='omni-icon'>";
              e.emoji &&
                (n =
                  "<span class='omni-emoji-action'>" + e.emojiChar + "</span>"),
                0 != i
                  ? $("#omni-extension #omni-list").append(
                      "<div class='omni-item' data-index='" +
                        i +
                        "' data-type='" +
                        e.type +
                        "' data-url='" +
                        e.url +
                        "'>" +
                        n +
                        "<div class='omni-item-details'><div class='omni-item-name'>" +
                        e.title +
                        "</div><div class='omni-item-desc'>" +
                        e.url +
                        "</div></div>" +
                        t +
                        "<div class='omni-select'>Select <span class='omni-shortcut'>⏎</span></div></div>"
                    )
                  : $("#omni-extension #omni-list").append(
                      "<div class='omni-item omni-item-active' data-index='" +
                        i +
                        "' data-type='" +
                        e.type +
                        "' data-url='" +
                        e.url +
                        "'>" +
                        n +
                        "<div class='omni-item-details'><div class='omni-item-name'>" +
                        e.title +
                        "</div><div class='omni-item-desc'>" +
                        e.url +
                        "</div></div>" +
                        t +
                        "<div class='omni-select'>Select <span class='omni-shortcut'>⏎</span></div></div>"
                    );
            }),
            $(".omni-extension #omni-results").html(e.length + " results");
        }
        function s() {
          "chrome-extension://mpanekjjajcabgnlbabmopeenljeoggm/tab.html" ==
          window.location.href
            ? chrome.runtime.sendMessage({ request: "restore-new-tab" })
            : ((n = !1), $("#omni-extension").addClass("omni-closing"));
        }
        function m(e) {
          $("#omni-extension-toast span").html(
            '"' + e.title + '" has been successfully performed'
          ),
            $("#omni-extension-toast").addClass("omni-show-toast"),
            setTimeout(() => {
              $(".omni-show-toast").removeClass("omni-show-toast");
            }, 3e3);
        }
        function r(e) {
          return /^(?:f|ht)tps?\:\/\//.test(e) || (e = "http://" + e), e;
        }
        function d(i) {
          var t = e[$(".omni-item-active").attr("data-index")];
          if (
            (s(),
            $(".omni-extension input")
              .val()
              .toLowerCase()
              .startsWith("/remove"))
          )
            chrome.runtime.sendMessage({
              request: "remove",
              type: t.type,
              action: t,
            });
          else if (
            $(".omni-extension input")
              .val()
              .toLowerCase()
              .startsWith("/history")
          )
            i.ctrlKey || i.metaKey
              ? window.open($(".omni-item-active").attr("data-url"))
              : window.open($(".omni-item-active").attr("data-url"), "_self");
          else if (
            $(".omni-extension input")
              .val()
              .toLowerCase()
              .startsWith("/bookmarks")
          )
            i.ctrlKey || i.metaKey
              ? window.open($(".omni-item-active").attr("data-url"))
              : window.open($(".omni-item-active").attr("data-url"), "_self");
          else
            switch (
              (chrome.runtime.sendMessage({
                request: t.action,
                tab: t,
                query: $(".omni-extension input").val(),
              }),
              t.action)
            ) {
              case "bookmark":
                i.ctrlKey || i.metaKey
                  ? window.open(t.url)
                  : window.open(t.url, "_self");
                break;
              case "scroll-bottom":
                window.scrollTo(0, document.body.scrollHeight), m(t);
                break;
              case "scroll-top":
                window.scrollTo(0, 0);
                break;
              case "navigation":
                i.ctrlKey || i.metaKey
                  ? window.open(t.url)
                  : window.open(t.url, "_self");
                break;
              case "fullscreen":
                document.documentElement.requestFullscreen();
                break;
              case "new-tab":
                window.open("");
                break;
              case "email":
                window.open("mailto:");
                break;
              case "url":
                i.ctrlKey || i.metaKey
                  ? window.open(t.url)
                  : window.open(t.url, "_self");
                break;
              case "goto":
                i.ctrlKey || i.metaKey
                  ? window.open(r($(".omni-extension input").val()))
                  : window.open(r($(".omni-extension input").val()), "_self");
                break;
              case "print":
                window.print();
                break;
              case "remove-all":
              case "remove-history":
              case "remove-cookies":
              case "remove-cache":
              case "remove-local-storage":
              case "remove-passwords":
                m(t);
            }
          chrome.runtime.sendMessage({ request: "get-actions" }, (i) => {
            (e = i.actions), o();
          });
        }
        $.get(chrome.runtime.getURL("/html/content.html"), (i) => {
          $(i).appendTo("body"),
            $("#omni-extension-toast img").attr(
              "src",
              chrome.runtime.getURL("assets/check.svg")
            ),
            chrome.runtime.sendMessage({ request: "get-actions" }, (i) => {
              e = i.actions;
            }),
            "chrome-extension://mpanekjjajcabgnlbabmopeenljeoggm/tab.html" ==
              window.location.href &&
              ((n = !0),
              $("#omni-extension").removeClass("omni-closing"),
              window.setTimeout(() => {
                $("#omni-extension input").focus();
              }, 100));
        });
        var c = [];
        $(document)
          .keydown((e) => {
            if (((c[e.keyCode] = !0), c[38])) {
              if (
                $(".omni-item-active").prevAll("div").not(":hidden").first()
                  .length
              ) {
                var i = $(".omni-item-active")
                  .prevAll("div")
                  .not(":hidden")
                  .first();
                $(".omni-item-active").removeClass("omni-item-active"),
                  i.addClass("omni-item-active"),
                  i[0].scrollIntoView({ block: "nearest", inline: "nearest" });
              }
            } else if (c[40]) {
              if (
                $(".omni-item-active").nextAll("div").not(":hidden").first()
                  .length
              ) {
                var t = $(".omni-item-active")
                  .nextAll("div")
                  .not(":hidden")
                  .first();
                $(".omni-item-active").removeClass("omni-item-active"),
                  t.addClass("omni-item-active"),
                  t[0].scrollIntoView({ block: "nearest", inline: "nearest" });
              }
            } else c[27] && n ? s() : c[13] && n && d(e);
          })
          .keyup((i) => {
            c[18] && c[16] && c[80]
              ? (null != e.find((e) => "pin" == e.action)
                  ? chrome.runtime.sendMessage({ request: "pin-tab" })
                  : chrome.runtime.sendMessage({ request: "unpin-tab" }),
                chrome.runtime.sendMessage({ request: "get-actions" }, (i) => {
                  (e = i.actions), o();
                }))
              : c[18] && c[16] && c[77]
              ? (null != e.find((e) => "mute" == e.action)
                  ? chrome.runtime.sendMessage({ request: "mute-tab" })
                  : chrome.runtime.sendMessage({ request: "unmute-tab" }),
                chrome.runtime.sendMessage({ request: "get-actions" }, (i) => {
                  (e = i.actions), o();
                }))
              : c[18] && c[16] && c[67] && window.open("mailto:"),
              (c = []);
          }),
          chrome.runtime.onMessage.addListener((i, t, a) => {
            "open-omni" == i.request
              ? n
                ? s()
                : chrome.runtime.sendMessage(
                    { request: "get-actions" },
                    (i) => {
                      (n = !0),
                        (e = i.actions),
                        $("#omni-extension input").val(""),
                        o(),
                        $("html, body").stop(),
                        $("#omni-extension").removeClass("omni-closing"),
                        window.setTimeout(() => {
                          $("#omni-extension input").focus(),
                            focusLock.on($("#omni-extension input").get(0)),
                            $("#omni-extension input").focus();
                        }, 100);
                    }
                  )
              : "close-omni" == i.request && s();
          }),
          $(document).on(
            "click",
            "#open-page-omni-extension-thing",
            function () {
              chrome.runtime.sendMessage({ request: "extensions/shortcuts" });
            }
          ),
          $(document).on(
            "mouseover",
            ".omni-extension .omni-item:not(.omni-item-active)",
            function () {
              $(".omni-item-active").removeClass("omni-item-active"),
                $(this).addClass("omni-item-active");
            }
          ),
          $(document).on("keyup", ".omni-extension input", function (t) {
            if (
              37 != t.keyCode &&
              38 != t.keyCode &&
              39 != t.keyCode &&
              40 != t.keyCode &&
              13 != t.keyCode &&
              37 != t.keyCode
            ) {
              var n = $(this).val().toLowerCase();
              if (
                ((function (e, i) {
                  var t = $(".omni-extension input");
                  8 != e.keyCode
                    ? "/t" == i
                      ? t.val("/tabs ")
                      : "/b" == i
                      ? t.val("/bookmarks ")
                      : "/h" == i
                      ? t.val("/history ")
                      : "/r" == i
                      ? t.val("/remove ")
                      : "/a" == i && t.val("/actions ")
                    : ("/tabs" != i &&
                        "/bookmarks" != i &&
                        "/actions" != i &&
                        "/remove" != i &&
                        "/history" != i) ||
                      t.val("");
                })(t, n),
                (n = $(this).val().toLowerCase()).startsWith("/history"))
              ) {
                $(
                  ".omni-item[data-index='" +
                    e.findIndex((e) => "search" == e.action) +
                    "']"
                ).hide(),
                  $(
                    ".omni-item[data-index='" +
                      e.findIndex((e) => "goto" == e.action) +
                      "']"
                  ).hide();
                var s = "";
                "/history" != (m = n.replace("/history ", "")) &&
                  (s = n.replace("/history ", "")),
                  chrome.runtime.sendMessage(
                    { request: "search-history", query: s },
                    (e) => {
                      a(e.history);
                    }
                  );
              } else if (n.startsWith("/bookmarks")) {
                var m;
                if (
                  ($(
                    ".omni-item[data-index='" +
                      e.findIndex((e) => "search" == e.action) +
                      "']"
                  ).hide(),
                  $(
                    ".omni-item[data-index='" +
                      e.findIndex((e) => "goto" == e.action) +
                      "']"
                  ).hide(),
                  "/bookmarks" != (m = n.replace("/bookmarks ", "")) && "" != m)
                ) {
                  s = n.replace("/bookmarks ", "");
                  chrome.runtime.sendMessage(
                    { request: "search-bookmarks", query: s },
                    (e) => {
                      a(e.bookmarks);
                    }
                  );
                } else a(e.filter((e) => "bookmark" == e.type));
              } else
                i && (o(), (i = !1)),
                  $(".omni-extension #omni-list .omni-item").filter(
                    function () {
                      var i;
                      if (n.startsWith("/tabs"))
                        $(
                          ".omni-item[data-index='" +
                            e.findIndex((e) => "search" == e.action) +
                            "']"
                        ).hide(),
                          $(
                            ".omni-item[data-index='" +
                              e.findIndex((e) => "goto" == e.action) +
                              "']"
                          ).hide(),
                          "/tabs" == (t = n.replace("/tabs ", ""))
                            ? $(this).toggle("tab" == $(this).attr("data-type"))
                            : ((t = n.replace("/tabs ", "")),
                              $(this).toggle(
                                ($(this)
                                  .find(".omni-item-name")
                                  .text()
                                  .toLowerCase()
                                  .indexOf(t) > -1 ||
                                  $(this)
                                    .find(".omni-item-desc")
                                    .text()
                                    .toLowerCase()
                                    .indexOf(t) > -1) &&
                                  "tab" == $(this).attr("data-type")
                              ));
                      else if (n.startsWith("/remove")) {
                        $(
                          ".omni-item[data-index='" +
                            e.findIndex((e) => "search" == e.action) +
                            "']"
                        ).hide(),
                          $(
                            ".omni-item[data-index='" +
                              e.findIndex((e) => "goto" == e.action) +
                              "']"
                          ).hide(),
                          "/remove" == (t = n.replace("/remove ", ""))
                            ? $(this).toggle(
                                "bookmark" == $(this).attr("data-type") ||
                                  "tab" == $(this).attr("data-type")
                              )
                            : ((t = n.replace("/remove ", "")),
                              $(this).toggle(
                                ($(this)
                                  .find(".omni-item-name")
                                  .text()
                                  .toLowerCase()
                                  .indexOf(t) > -1 ||
                                  $(this)
                                    .find(".omni-item-desc")
                                    .text()
                                    .toLowerCase()
                                    .indexOf(t) > -1) &&
                                  ("bookmark" == $(this).attr("data-type") ||
                                    "tab" == $(this).attr("data-type"))
                              ));
                      } else if (n.startsWith("/actions")) {
                        var t;
                        $(
                          ".omni-item[data-index='" +
                            e.findIndex((e) => "search" == e.action) +
                            "']"
                        ).hide(),
                          $(
                            ".omni-item[data-index='" +
                              e.findIndex((e) => "goto" == e.action) +
                              "']"
                          ).hide(),
                          "/actions" == (t = n.replace("/actions ", ""))
                            ? $(this).toggle(
                                "action" == $(this).attr("data-type")
                              )
                            : ((t = n.replace("/actions ", "")),
                              $(this).toggle(
                                ($(this)
                                  .find(".omni-item-name")
                                  .text()
                                  .toLowerCase()
                                  .indexOf(t) > -1 ||
                                  $(this)
                                    .find(".omni-item-desc")
                                    .text()
                                    .toLowerCase()
                                    .indexOf(t) > -1) &&
                                  "action" == $(this).attr("data-type")
                              ));
                      } else
                        $(this).toggle(
                          $(this)
                            .find(".omni-item-name")
                            .text()
                            .toLowerCase()
                            .indexOf(n) > -1 ||
                            $(this)
                              .find(".omni-item-desc")
                              .text()
                              .toLowerCase()
                              .indexOf(n) > -1
                        ),
                          "" == n
                            ? ($(
                                ".omni-item[data-index='" +
                                  e.findIndex((e) => "search" == e.action) +
                                  "']"
                              ).hide(),
                              $(
                                ".omni-item[data-index='" +
                                  e.findIndex((e) => "goto" == e.action) +
                                  "']"
                              ).hide())
                            : ((i = n),
                              new RegExp(
                                "^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$",
                                "i"
                              ).test(i)
                                ? ($(
                                    ".omni-item[data-index='" +
                                      e.findIndex((e) => "search" == e.action) +
                                      "']"
                                  ).hide(),
                                  $(
                                    ".omni-item[data-index='" +
                                      e.findIndex((e) => "goto" == e.action) +
                                      "']"
                                  ).show(),
                                  $(
                                    ".omni-item[data-index='" +
                                      e.findIndex((e) => "goto" == e.action) +
                                      "'] .omni-item-name"
                                  ).html(n))
                                : ($(
                                    ".omni-item[data-index='" +
                                      e.findIndex((e) => "search" == e.action) +
                                      "']"
                                  ).show(),
                                  $(
                                    ".omni-item[data-index='" +
                                      e.findIndex((e) => "goto" == e.action) +
                                      "']"
                                  ).hide(),
                                  $(
                                    ".omni-item[data-index='" +
                                      e.findIndex((e) => "search" == e.action) +
                                      "'] .omni-item-name"
                                  ).html('"' + n + '"')));
                    }
                  );
              $(".omni-extension #omni-results").html(
                $("#omni-extension #omni-list .omni-item:visible").length +
                  " results"
              ),
                $(".omni-item-active").removeClass("omni-item-active"),
                $(".omni-extension #omni-list .omni-item:visible")
                  .first()
                  .addClass("omni-item-active");
            }
          }),
          $(document).on("click", ".omni-item-active", d),
          $(document).on("click", ".omni-extension #omni-overlay", s);
      });
  }
})(window, document);
