"use strict";!function(){var l=window,q=l.location,u=document,o="undefined"!=typeof chrome&&chrome||{},M=Object.defineProperty,t=o.runtime.getURL("PATH/").replace("/PATH/",""),i=t.startsWith("safari-web-extension://"),t=!i&&t.startsWith("moz-extension://"),R=!i&&!t;function F(r){return new Promise(function(n,a){o.tabs.query(r,function(e){var t=o.runtime.lastError;t?a(t):Array.isArray(e)?i&&r&&r.url?(t=e.filter(function(e){return e.url}),n(t)):n(e):a(new Error("No array returned"))}),setTimeout(n,2e3)})}function N(r){var i,s,e,t;return r&&"string"==typeof r?(i=-1===r.indexOf("?"),s=-1===r.indexOf("#"),e=r.split("?")[0].split("#")[0]+"*",t={currentWindow:!0},(e=e)&&(t.url=e),F(t).then(function(e){for(var t=e.length-1;0<=t;t--){var n=e[t],a=n.url;if(a){if(a===r)return n;try{a=new URL(a)}catch(e){continue}if(i&&(a.search=""),s&&(a.hash=""),a.href===r)return n}}return null},function(){return null})):Promise.resolve(null)}function a(e,t){return new Promise(function(n,a){o.tabs.update(e,t,function(e){var t=o.runtime.lastError;t?a(t):n(e)})})}function H(i){return new Promise(function(n,a){function r(e){var t=e.message||"";"openerTabId"in i&&-1!==t.indexOf("openerTabId")?(delete i.openerTabId,n(H(i))):R&&-1!==t.indexOf("Saved groups are not editable")?n():a(e)}try{o.tabs.create(i,function(e){var t=o.runtime.lastError;t?r(t):n(e)})}catch(e){r(e)}})}function U(e){l.open(e,"_blank","noopener")}function W(t){try{l.top.location.href=t}catch(e){U(t)}}function z(t,e){var n=e||null;return a(n,{url:t}).catch(function(){if(!n)return F({active:!0,currentWindow:!0}).then(function(e){return e[0]},function(){return null}).then(function(e){if(e.id)return z(t,e.id);W(t)});W(t)})}function G(e,t,n,r){var a={url:e};return!1===t&&n&&(a.active=!1),r&&(a.openerTabId=r.id,a.index=r.index+1),H(a).then(function(e){var t,n,a;return t=e,n=r,o.tabs.group&&t&&n&&(a=n.groupId,t.groupId!==a)&&o.tabs.group({groupId:a,tabIds:t.id},function(){o.runtime.lastError||(t.groupId=a)}),e},function(){U(e)})}function V(e,t,n,a,r){if(!e)return Promise.reject(new Error("Missing URL"));if(!n){var i;if(t)return i=Boolean(a&&a.incognito),s={incognito:i,url:e},new Promise(function(n,a){o.windows.create(s,function(e){var t=o.runtime.lastError;t?a(t):n(e)})}).catch(function(){return G(e,t,n,a)});if(!1===n)return z(e,r)}var s;return G(e,t,n,a)}t=!0;try{var e=o.i18n.getMessage("@@ui_locale");"string"==typeof e&&"und"!==e&&(j=e.replace("_","-"))}catch(e){t=!1}e=j;if(!e)try{var n=o.runtime.getManifest().default_locale;"string"==typeof n&&(e=n.replace("_","-"))}catch(e){}var J,r,s,c,K,d,Q={},f=(!function(e,t){for(var n in t)M(e,n,{get:t[n],enumerable:!0})}(Q,{add:function(){return ae},contains:function(){return ee},getDefaultServices:function(){return ce},getLastUsed:function(){return ie},getLastUsedNonToolsPage:function(){return se},init:function(){return $},onChange:function(){return re},remove:function(){return te},replace:function(){return ne},set:function(){return y},setLastUsed:function(){return oe}}),[]),p=[],g=[],m=["search","maps","translate","news","youtube","gmail","calendar","drive","keep","tasks"],X=["youtube","ytstudio","mybusiness","photos","contacts","save","myaccount","passwords","myactivity","myadcenter"],Y=["accountchooser","contentblocking","customize","missingpermissions","newtab","portal","pagestateupdate","notifications","removedialog"],Z=["applauncher","extensionsettings"],h={"keep-pro":"keep",keeplite:"keep",shoppinglist:"keep",music:"ytmusic",playmusic:"ytmusic",podcasts:"ytmusic",tiltbrushsketches:"poly",vrblocks:"poly",trackedflightprices:"flights",destinations:"googletravel",flightsandhotels:"googletravel",flightshotels:"googletravel",packages:"googletravel",travelpackages:"googletravel",trips:"googletravel",vacations:"googletravel",googlepay:"gpay",payments:"paymentscenter",chromeapps:"browserapps",chromebookmarks:"browserbookmarks",chrometopsites:"browsertopsites",adwords:"ads",appmaker:"script",calendarlite:"calendar",duo:"meet",express:"shopping",gmaillite:"gmail",gplus:"currents",hangouts:"chat",publicalerts:"covid19",shortlists:"save",webmastertools:"searchconsole"},v={};function b(a){f=[],p=[],Object.keys(v).forEach(function(e){var t=-1!==a.indexOf(e),n=v[e].hidden;(!n||t&&"unused"===n)&&(t?f:p).push(e)}),f=f.sort(function(e,t){return a.indexOf(e)<a.indexOf(t)?-1:1}),p=p.sort(function(e,t){return v[e].label<v[t].label?-1:1})}function $(e){g=[],d=new Promise(function(e){K=e}),v=e.servicesDatabase||{};var t=browserStorage.sync.get(["bm_pref__portal__services"]).then(function(e){return e.bm_pref__portal__services}),t=[browserStorage.local.getItem("bm_pref__portal__lastused"),t,e.servicesDatabaseRequest,e.accountRequest],e=Promise.all(t).then(function(e){var t=h[e[0]]||e[0],n=e[1]||m;if(v=e[2],J=e[3],c=t||n[0],r=s=c,J.pageId)return-1===(f=Object.keys(v).filter(function(e){return v[e].brandAccount&&!v[e].hidden}).sort(function(e,t){return X.indexOf(e)-X.indexOf(t)})).indexOf(r)&&(r="aboutme"),null;Array.isArray(n)?(e=n.join(" "),Object.keys(h).forEach(function(e){var t=n.indexOf(e);-1!==t&&(n[t]=h[e])}),b(n),e!==f.join(" ")&&browserStorage.sync.setItem("bm_pref__portal__services",f)):(r=t||m[0],b(m))});K(e)}function y(e){b(e),browserStorage.sync.setItem("bm_pref__portal__services",f),g.forEach(function(e){e(f,p)})}function ee(e){return-1!==f.indexOf(e)}function te(e,t){t=t||f.indexOf(e);-1!==t&&(f.splice(t,1),y(f))}function ne(e,t){var n,a;-1!==p.indexOf(t)&&-1!==(n=f.indexOf(e))&&(-1===(a=f.indexOf(t))?(f[n]=t,y(f)):te(e,a))}function ae(e){y(f.concat(e))}function re(e){var t;g.push(e),t=e,d.then(function(){t(f,p)})}function ie(){return d.then(function(){return 0<f.length?{serviceId:s}:{serviceId:"customize",sessionParameters:{welcome:!0}}})}function se(){return c}function oe(e){r=e,-1===Y.indexOf(e)&&(s=e,-1===Z.indexOf(e))&&(c=e),browserStorage.local.setItem("bm_pref__portal__lastused",s)}function ce(){return m}var w,P,_,k,le,I,ue,de,fe,j=new URLSearchParams(q.search),x=u.documentElement,pe=!1,L=!1,O=[],S=j.get("page"),E=j.get("environment"),n=q.pathname,ge=(n.endsWith("/popup.html")?E="popup":n.endsWith("/options.html")&&(S="extensionsettings",E="options"),!1),A=cjgApis.account.missingAccountData,me="";function B(e){return A=e,me=cjgFrontend.urls.createWizPath(A),A}var D=cjgApis.session.init(B).then(B);function C(e,t,n){return V(e,t,n).then(function(){"popup"!==E||n&&!1===t||l.close()})}function he(t,e,n){return t?e||n?C(t,e,n):"newtab"===E?a(null,{active:!0,url:t}).catch(function(){return C(t)}):N(t).then(function(e){return e?a(e.id,{active:!0}).catch(function(){return C(t)}):C(t)}):Promise.resolve()}var ve,T=function(){var o=[],c=S||"search",l=!1;return{navigate:function e(t,n){if(n&&n.softInit){if(l)return}else l=!0;var a,r,i=_[t];function s(){t===c&&i.onPageDisplayHandler(n||{})}i&&i.linkOnly?e(i.pageId,i.pageParameters||n):(i&&-1===O.indexOf(t)&&we(t),a=c=t,r=P.querySelector(":scope > .selected"),a!==(r&&r.dataset.id||null)&&(a=P.querySelector(':scope > [data-id="'+a+'"]'),r&&r.classList.remove("selected"),a)&&a.classList.add("selected"),o.forEach(function(e){e(c)}),S||oe(c),i&&(i.onPageDisplayHandler?s():i.lastPageDisplayCallback=s))},onChange:function(e){o.push(e),e(c)},restore:function(){l=!1,o=[]}}}();function be(e){var t=(e=e||{}).serviceData||{},n={onNewTab:!0,portal:cjBasics.navigator.isFirefoxMobile,notifications:S&&t.showNotifications&&A.validSession,accountchooser:S&&A.validSession,signin:S&&!A.validSession};return{missingGooglePermission:ge,instanceParameters:e.instanceParameters||{},darkMode:t.preferDarkMode?!pe:L,setOnPageDisplayHandler:e.setOnPageDisplayHandler,account:A,wizPath:me,openTab:he,requirePage:ye,loadPage:we,environment:E,standaloneService:S,pageManager:T,userServices:Q,servicesDatabase:_,ogbFeatures:n}}function ye(e){var t=_[e]||{},n=t.loadPromise;if(!n){var a="/pages/"+e+"/index.js",r=[k,I,D],i=("portal"!==e&&r.push(le,fe,de),t.preload||[]),s=(t.pageId&&t.pageId!==e?i.push(t.pageId):r.push(cjBasics.loadScript(a)),t.extraCss&&r.push(cjBasics.loadStyle("/pages/"+e+"/index.css")),t.dnsPrefetch);if(s)for(var o=0;o<s.length;o++){var c=u.createElement("link");c.rel="dns-prefetch",c.href=s[o],u.head.appendChild(c)}Array.isArray(i)&&l.requestIdleCallback&&l.requestIdleCallback(function(){i.forEach(ye)},{timeout:2e3}),Array.isArray(t.dependencies)&&t.dependencies.forEach(function(e){r.push(ye(e))}),n=Promise.all(r),t.loadPromise=n}return n}function we(e){O.push(e);var t=_[e],n=t.pageId||e,a=t.pageParameters,r=!cjBasics.webRequest.getWrifSupported()&&t.wrifFallbackPageId,r=(r&&(_[r]?n=r:(n="pagestateupdate",a={productId:e})),cjBasics.navigator.isFirefox&&t.firefoxFallbackPageId),r=_[n=r?r:n];ge&&!r.noGooglePermissionNeeded?(n="pagestateupdate",a={productId:e,missingPermissions:!0}):"valid"===r.requireSignin&&cjBasics.webRequest.getHasFirefoxContentBlocking()?(n="pagestateupdate",a={productId:e,contentBlocking:!0}):!A.validSession&&r.requireSignin?(n="pagestateupdate",a={productId:e,signinRequired:!0}):!A.pageId||t.brandAccount&&r.brandAccount||(n="pagestateupdate",a={productId:e,brandAccountUnsupported:!0});r=be({serviceData:t,setOnPageDisplayHandler:function(e){t.onPageDisplayHandler=e,setTimeout(function(){"function"==typeof t.lastPageDisplayCallback&&t.lastPageDisplayCallback(),t.lastPageDisplayCallback=null})},instanceParameters:a}),a=cjce.createElement("bm-app",{bmApis:r,pageId:n});a.dataset.id=e,P.appendChild(a)}function Pe(){var r=matchMedia("(prefers-color-scheme: dark)");(L=r.matches)&&x.classList.add("bm-style-flag--dark"),r.addEventListener&&r.addEventListener("change",function(){L=r.matches,x.classList.toggle("bm-style-flag--dark",L);for(var e=P.children,t=0;t<e.length;t++){var n=e[t],a=n.dataset.id;_[a].preferDarkMode||n.classList.toggle("cjmd--dark",L)}})}function _e(){u.body.textContent="",(w=u.createElement("div")).className="bm-ele-main",u.body.appendChild(w),ue=browserStorage.sync.getItem("bm_pref__main__language").then(function(e){return cjBasics.lang.overwriteLanguage(e)}),k=ue.then(function(){return _=cjBasics.pages,Object.keys(_).forEach(function(e){var t=_[e].labelI18n;t&&(_[e].label=cjBasics.lang.i18n(t,_[e].label))}),cjBasics.isUsaCheck()&&(_.movies.color=!0,_.movies.iconName="tv",_.movies.label=cjBasics.lang.i18n("cj_i18n_06402","Google TV")),_}),le=cjBasics.webRequest.restoreWrifSupported(),I="options"===E?(Pe(),Promise.resolve()):browserStorage.sync.getItem("bm_pref__main__theme").then(function(e){if(e&&"auto"!==e){if("light"===e)pe=!0,x.classList.add("bm-style-flag--light");else{if("dark"!==e)return;L=!0,x.classList.add("bm-style-flag--dark")}e=u.querySelector('meta[name="color-scheme"]');e&&(e.content=L?"dark":"light")}else Pe()}),0<O.length&&(O=[],T.restore(),cjgApis.session.resetCache(),D=cjgApis.session.init(B).then(B)),"newtab"===E&&(u.title="New Tab for Google™"),$({accountRequest:D,servicesDatabaseRequest:k}),o.runtime.onMessage.addListener(function(e){e=e&&e.method;e&&"reloadAllInstances"===e&&cjBasics.reloadSelf()});var t,n,e=!S&&"sidebar"!==E&&!cjBasics.navigator.isFirefoxMobile;e&&((t=u.createElement("div")).className="bm-ele-mainportal",n="portal","newtab"===E?(n="newtab",t.classList.add("bm-ele-mainportal--newtab")):t.classList.add("bm-ele-mainportal--sideportal"),w.appendChild(t),Promise.all([k,I]).then(function(){var e=_[n],e=cjce.createElement("bm-app",{pageId:n,bmApis:be({serviceData:e})});t.appendChild(e)})),e=e,(P=u.createElement("div")).className="bm-ele-mainwindow","newtab"===E?P.classList.add("bm-ele-mainwindow--newtab"):e&&P.classList.add("bm-ele-mainwindow--sideportal"),w.appendChild(P),setTimeout(function(){x.classList.add("bm-style-flag--loaded")},10),fe=("object"!=typeof o.permissions?Promise.resolve(!0):new Promise(function(e){o.permissions.contains({origins:["https://*.google.com/*","https://*.google.com/cjg-auth/*"]},e)})).then(function(e){ge=!e}),de=cjBasics.navigator.getCurrentTabIdRequest(),Promise.all([k,D,le,fe,I]).then(function(){S?T.navigate(S,{softInit:!0}):ie().then(function(e){var t=e.sessionParameters||{};t.softInit=!0,T.navigate(e.serviceId,t)})},function(e){})}S&&"sidebar"!==E&&x.classList.add("bm-style-flag--singlepage"),cjBasics.navigator.isFirefox&&x.classList.add("bm-style-flag--firefox"),"popup"!==E&&"options"!==E||(x.classList.add("bm-style-flag--no-cloak"),"popup"===E?(cjBasics.navigator.isMac&&setTimeout(function(){o.runtime.sendMessage({method:"closeAuthPopup"})},100),(cjBasics.navigator.isFirefox||cjBasics.navigator.isMac&&!cjBasics.navigator.isSafari)&&(ve=1600,function e(){x.classList.add("bm-style-flag--macfix"),setTimeout(function(){x.classList.remove("bm-style-flag--macfix")},20),0<ve&&(setTimeout(e,500),ve-=500)}())):"options"===E&&x.classList.add("bm-style-flag--options")),u.documentElement.dir=t&&o.i18n.getMessage("@@bidi_dir")||"ltr",u.documentElement.lang=e,"popup"===E||"options"===E?"complete"===u.readyState?setTimeout(_e,100):l.addEventListener("load",function(){setTimeout(_e,100)}):_e()}();