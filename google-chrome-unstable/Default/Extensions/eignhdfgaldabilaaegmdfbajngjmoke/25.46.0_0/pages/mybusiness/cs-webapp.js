"use strict";!function(){var t,e,n,i,o=window,a=o.location,r=document,s=("undefined"!=typeof chrome&&chrome||{}).runtime.getURL("PATH/").replace("/PATH/",""),d=s.startsWith("safari-web-extension://");d||s.startsWith("moz-extension://"),"undefined"!=typeof KeyboardEvent&&"key"in KeyboardEvent.prototype&&!/MSIE |Edge\/|Trident.*rv:11\./.test(navigator.userAgent)&&String.quote;function m(t,e,n){o.parent.postMessage({bm_method:t,bm_request:n,bm_value:e},s)}t=function(t,e){return"mybusiness"===e&&("https://business.google.com"===t||"https://mybusiness.google.com"===t)},e=function(){var e,n,i,o,t;function s(){var t;t=a.pathname.match(/\/(?:u\/\d\/)?([a-z]{2,30})(?:\/l\/(\d{10,28}))?/),e=t[1],n=t[2],t=r.documentElement.textContent.split('[["'+n+'","')[1],o=t?(t=t.split('",["'),i=t[0].split('",')[0],t[1].split('"],')[0].split('"]\n')[0].split('"]↵')[0].split('"]')[0].split('","')):i=null,m("mybusinessViewData",{viewId:e,listingId:n,listingTitle:i,addressData:o})}!function t(){s(),setTimeout(t,1e3)}(),t=function(){m("mybusinessStopLoading"),s()},"complete"===r.readyState||"loaded"===r.readyState||"interactive"===r.readyState?t():r.addEventListener("DOMContentLoaded",t)},function(t){var e,n;if(o.top!==o.self&&!(r.documentElement instanceof SVGSVGElement))return"object"!=typeof(e=a.ancestorOrigins)?1:(n=d?s.toLowerCase():s,1===e.length?e[0]===n:t&&2===e.length&&e[1]===n&&!e[0].endsWith(".google.com"))}(n)&&(i=(i=(n=a.search).match(/[&?]bm_cid=([\da-z-]{2,25})(?:&|$)/))&&i[1],t(origin,i,n))&&(i&&(r.documentElement.dataset.bmCid=i),e())}();