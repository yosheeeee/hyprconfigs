"use strict";!function(){var o=window,a=o.location,r=document,s=("undefined"!=typeof chrome&&chrome||{}).runtime.getURL("PATH/").replace("/PATH/",""),i=s.startsWith("safari-web-extension://");i||s.startsWith("moz-extension://"),"undefined"!=typeof KeyboardEvent&&"key"in KeyboardEvent.prototype&&!/MSIE |Edge\/|Trident.*rv:11\./.test(navigator.userAgent)&&String.quote;var e,t,n,c,m=null;function d(){var e,t,n=a.pathname;n!==m&&(e="searchlabsUpdatePath",n=m=n,o.parent.postMessage({bm_method:e,bm_request:t,bm_value:n},s)),setTimeout(d,100)}e=function(e,t){return"searchlabs"===t&&"https://labs.google.com"===e&&a.pathname.startsWith("/search")},t=function(){d()},function(e){var t,n;if(o.top!==o.self&&!(r.documentElement instanceof SVGSVGElement))return"object"!=typeof(t=a.ancestorOrigins)?1:(n=i?s.toLowerCase():s,1===t.length?t[0]===n:e&&2===t.length&&t[1]===n&&!t[0].endsWith(".google.com"))}(n)&&(c=(c=(n=a.search).match(/[&?]bm_cid=([\da-z-]{2,25})(?:&|$)/))&&c[1],e(origin,c,n))&&(c&&(r.documentElement.dataset.bmCid=c),t())}();