"use strict";!function(){var a=window,i=a.location,s=document,o="undefined"!=typeof chrome&&chrome||{},r=o.runtime.getURL("PATH/").replace("/PATH/",""),c=r.startsWith("safari-web-extension://");c||r.startsWith("moz-extension://");"undefined"!=typeof KeyboardEvent&&"key"in KeyboardEvent.prototype&&!/MSIE |Edge\/|Trident.*rv:11\./.test(navigator.userAgent)&&String.quote;var e=!0;try{var t=o.i18n.getMessage("@@ui_locale");"string"==typeof t&&"und"!==t&&(n=t.replace("_","-"))}catch(t){e=!1}var u,n,g=n;if(!g)try{var l=o.runtime.getManifest().default_locale;"string"==typeof l&&(g=l.replace("_","-"))}catch(t){}function h(){u||o.runtime.sendMessage({method:"closeAuthPopup"})}function p(){o.runtime.sendMessage({method:"reloadAllInstances"},h)}function f(t){cjgApis.session.changeAccount(t,!0).then(p,p),setTimeout(p,1e3)}function d(e){cjgApis.account.list({listPages:!1}).then(function(t){Array.isArray(t)?0!==t.length&&t[0].validSession?f(function(t,e){for(var n=t[0],a=0;a<t.length;a++){var i=t[a];if(i.validSession){if(i.authuser===e)return i;i.authuser>n.authuser&&(n=i)}}return n}(t,e)):f(cjgApis.account.noAccountData):f(cjgApis.account.missingAccountData)})}function m(t,e){Promise.all([cjgApis.account.list({targetAuthuser:e}),cjgApis.auth.getTokenInfo(t)]).then(function(t){t=function(t,e){for(var n=0;n<t.length;n++){var a=t[n];if(a.obfuscatedId===e)return a}return null}(t[0],t[1].sub);t?f(t):p()},p)}function v(){var t=s.documentElement;t.dir=e&&o.i18n.getMessage("@@bidi_dir")||"ltr",t.lang=g,(s.body||t).textContent=""}function A(){var t=i.href,e=(t.match(/authuser=(\d)/)||[])[1]||null,t=(t.split("access_token=")[1]||"").split("&")[0],n=(i.hash||"").split("--macpopup"),n=(u=n[1]&&cjBasics.navigator.isMac&&!cjBasics.navigator.isOpera,n[0].replace("#","")),a=i.pathname.split("/")[3];"signin"===a||"signin"===n?d(e):("signout"!==a&&"signout"!==n||f(cjgApis.account.noAccountData),t?m(t,e):(u?p:h)())}function y(){var t,e,n=i.href;o.runtime.sendMessage({data:n,method:"cjgAuthUrl"}),c&&(t="cjgAuthUrl",a.parent.postMessage({bm_method:t,bm_request:e,bm_value:n},r))}v(),t=i.origin,n=i.pathname,(l=a.top===a.self)&&t===r&&"/views/cjg-popup.html"===n?A():"https://www.google.com"===t&&(t=n.match(/^\/(?:images\/)?cjg-(auth|apis)\/(.+)/))&&(n=t[1])&&(c||t[2]===function(){var t;try{t=o.i18n.getMessage("@@extension_id")}catch(t){}return t||r.split("://")[1]}())&&(l?A():"auth"===n&&function(t){var e,n;if(a.top!==a.self&&!(s.documentElement instanceof SVGSVGElement))return"object"!=typeof(e=i.ancestorOrigins)?1:(n=c?r.toLowerCase():r,1===e.length?e[0]===n:t&&2===e.length&&e[1]===n&&!e[0].endsWith(".google.com"))}()&&y())}();