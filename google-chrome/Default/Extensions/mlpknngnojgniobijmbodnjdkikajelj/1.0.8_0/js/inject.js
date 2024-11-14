!(function (n, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define(e)
    : ((n = n || self).focusLock = e());
})(this, function () {
  "use strict";
  var n = function (n) {
      for (var e = Array(n.length), t = 0; t < n.length; ++t) e[t] = n[t];
      return e;
    },
    e = function (n) {
      return Array.isArray(n) ? n : [n];
    },
    t = function (n, e) {
      var t = n.tabIndex - e.tabIndex,
        r = n.index - e.index;
      if (t) {
        if (!n.tabIndex) return 1;
        if (!e.tabIndex) return -1;
      }
      return t || r;
    },
    r = function (e, r, o) {
      return n(e)
        .map(function (n, e) {
          return {
            node: n,
            index: e,
            tabIndex:
              o && -1 === n.tabIndex
                ? (n.dataset || {}).focusGuard
                  ? 0
                  : -1
                : n.tabIndex,
          };
        })
        .filter(function (n) {
          return !r || n.tabIndex >= 0;
        })
        .sort(t);
    },
    o = [
      "button:enabled:not([readonly])",
      "select:enabled:not([readonly])",
      "textarea:enabled:not([readonly])",
      "input:enabled:not([readonly])",
      "a[href]",
      "area[href]",
      "iframe",
      "object",
      "embed",
      "[tabindex]",
      "[contenteditable]",
      "[autofocus]",
    ],
    u = "data-focus-lock",
    i = o.join(","),
    f = i + ", [data-focus-guard]",
    c = function (e, t) {
      return e.reduce(function (e, r) {
        return e.concat(
          n(r.querySelectorAll(t ? f : i)),
          r.parentNode
            ? n(r.parentNode.querySelectorAll(o.join(","))).filter(function (
                n
              ) {
                return n === r;
              })
            : []
        );
      }, []);
    },
    a = function n(e) {
      return (
        !e ||
        e === document ||
        (!(
          (t = window.getComputedStyle(e, null)) &&
          t.getPropertyValue &&
          ("none" === t.getPropertyValue("display") ||
            "hidden" === t.getPropertyValue("visibility"))
        ) &&
          n(e.parentNode))
      );
      var t;
    },
    d = function n(e) {
      var t =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [];
      return t.push(e), e.parentNode && n(e.parentNode, t), t;
    },
    l = function (n, e) {
      for (var t = d(n), r = d(e), o = 0; o < t.length; o += 1) {
        var u = t[o];
        if (r.indexOf(u) >= 0) return u;
      }
      return !1;
    },
    s = function (e) {
      return n(e)
        .filter(function (n) {
          return a(n);
        })
        .filter(function (n) {
          return (function (n) {
            return !(
              ("INPUT" === n.tagName || "BUTTON" === n.tagName) &&
              ("hidden" === n.type || n.disabled)
            );
          })(n);
        });
    },
    m = function (n, e) {
      return r(s(c(n, e)), !0, e);
    },
    v = function (e) {
      return s(
        ((t = e.querySelectorAll("[data-autofocus-inside]")),
        n(t)
          .map(function (n) {
            return c([n]);
          })
          .reduce(function (n, e) {
            return n.concat(e);
          }, []))
      );
      var t;
    },
    y = function (n) {
      return "INPUT" === n.tagName && "radio" === n.type;
    },
    p = function (n) {
      return n[0] && n.length > 1 && y(n[0]) && n[0].name
        ? (function (n, e) {
            return (
              e
                .filter(y)
                .filter(function (e) {
                  return e.name === n.name;
                })
                .filter(function (n) {
                  return n.checked;
                })[0] || n
            );
          })(n[0], n)
        : n[0];
    },
    b =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (n) {
            return typeof n;
          }
        : function (n) {
            return n &&
              "function" == typeof Symbol &&
              n.constructor === Symbol &&
              n !== Symbol.prototype
              ? "symbol"
              : typeof n;
          },
    x = function n(e) {
      for (var t = e.length, r = 0; r < t; r += 1)
        for (
          var o = function (t) {
              if (r !== t && e[r].contains(e[t]))
                return {
                  v: n(
                    e.filter(function (n) {
                      return n !== e[t];
                    })
                  ),
                };
            },
            u = 0;
          u < t;
          u += 1
        ) {
          var i = o(u);
          if ("object" === (void 0 === i ? "undefined" : b(i))) return i.v;
        }
      return e;
    },
    h = function n(e) {
      return e.parentNode ? n(e.parentNode) : e;
    },
    g = function (t) {
      return e(t)
        .filter(Boolean)
        .reduce(function (e, t) {
          var r = t.getAttribute(u);
          return (
            e.push.apply(
              e,
              r
                ? x(
                    n(
                      h(t).querySelectorAll(
                        '[data-focus-lock="' +
                          r +
                          '"]:not([data-focus-lock-disabled="disabled"])'
                      )
                    )
                  )
                : [t]
            ),
            e
          );
        }, []);
    },
    N = function (n) {
      return !(n.dataset && n.dataset.focusGuard);
    },
    S = function (n, t) {
      var o = document && document.activeElement,
        u = g(n).filter(N),
        i = (function (n, t, r) {
          var o = e(n),
            u = e(t),
            i = o[0],
            f = null;
          return (
            u.filter(Boolean).forEach(function (n) {
              (f = l(f || n, n) || f),
                r.filter(Boolean).forEach(function (n) {
                  var e = l(i, n);
                  e && (f = !f || e.contains(f) ? e : l(e, f));
                });
            }),
            f
          );
        })(o || n, n, u),
        f = m(u).filter(function (n) {
          var e = n.node;
          return N(e);
        });
      if (
        f[0] ||
        (f = ((a = u), r(s(c(a)), !1)).filter(function (n) {
          var e = n.node;
          return N(e);
        }))[0]
      ) {
        var a,
          d,
          y,
          b = m([i]).map(function (n) {
            return n.node;
          }),
          x =
            ((d = f),
            b
              .map(function (n) {
                return d.find(function (e) {
                  var t = e.node;
                  return n === t;
                });
              })
              .filter(Boolean)),
          h = x.map(function (n) {
            return n.node;
          }),
          S = (function (n, e, t, r, o) {
            var u = n.length,
              i = n[0],
              f = n[u - 1];
            if (!(n.indexOf(t) >= 0)) {
              var c = e.indexOf(t),
                a = e.indexOf(r || c),
                d = n.indexOf(r),
                l = c - a,
                s = e.indexOf(i),
                m = e.indexOf(f);
              return -1 === c || -1 === d
                ? n.indexOf(o.length ? p(o) : p(n))
                : (!l && d >= 0) || (l && Math.abs(l) > 1)
                ? d
                : c <= s
                ? u - 1
                : c > m
                ? 0
                : l
                ? Math.abs(l) > 1
                  ? d
                  : (u + d + l) % u
                : void 0;
            }
          })(
            h,
            b,
            o,
            t,
            h.filter(
              ((y = (function (n) {
                return n.reduce(function (n, e) {
                  return n.concat(v(e));
                }, []);
              })(u)),
              function (n) {
                return (
                  !!n.autofocus ||
                  (n.dataset && !!n.dataset.autofocus) ||
                  y.indexOf(n) >= 0
                );
              })
            )
          );
        return void 0 === S ? S : x[S];
      }
    },
    O = function (n) {
      return n === document.activeElement;
    },
    A = function (e) {
      var t = document && document.activeElement;
      return (
        !(!t || (t.dataset && t.dataset.focusGuard)) &&
        g(e).reduce(function (e, r) {
          return (
            e ||
            r.contains(t) ||
            (function (e) {
              return (
                (t = n(e.querySelectorAll("iframe"))),
                (r = O),
                !!t.filter(function (n) {
                  return n === r;
                })[0]
              );
              var t, r;
            })(r)
          );
        }, !1)
      );
    },
    E = 0,
    I = !1,
    k = 0,
    q = null,
    j = function () {
      return (
        (document && document.activeElement === document.body) ||
        (document &&
          n(document.querySelectorAll("[data-no-focus-lock]")).some(function (
            n
          ) {
            return n.contains(document.activeElement);
          }))
      );
    },
    B = function () {
      var n = !1;
      if (k) {
        var e = k;
        j() ||
          (e &&
            !A(e) &&
            (n = (function (n, e) {
              var t,
                r = S(n, e);
              if (!I && r) {
                if (E > 2)
                  return (
                    (I = !0),
                    void setTimeout(function () {
                      I = !1;
                    }, 1)
                  );
                E++,
                  (t = r.node).focus(),
                  t.contentWindow && t.contentWindow.focus(),
                  E--;
              }
            })(e, q)),
          (q = document.activeElement));
      }
      return n;
    },
    P = [],
    T = function (n) {
      return (
        (e = P.filter(function (n) {
          return n;
        }).slice(-1)[0]),
        (k = e),
        !!void (e && B()) && (n && n.preventDefault(), !0)
      );
      var e;
    };
  return {
    on: function (n) {
      0 === P.length && document.addEventListener("focusin", T),
        P.indexOf(n) < 0 && (P.push(n), T());
    },
    off: function (n) {
      (P = P.filter(function (e) {
        return e !== n;
      })),
        T(),
        0 === P.length && document.removeEventListener("focusin", T);
    },
  };
});
