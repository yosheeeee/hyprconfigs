/*! For license information please see content-3.js.LICENSE.txt */
(()=>{var t,e,r,s,n={2296:(t,e,r)=>{"use strict";var s=r(4542),n=r.n(s),o=r(2787),i=r.n(o),a=r(3036),u=r(7036);(0,s.extend)(i()),a.Ay.extend({retry:{limit:5,methods:["get","post"]},hooks:{afterResponse:[async(t,e,r)=>{if(r.ok){const e=r.clone(),s=n().utc().format();let o=null;try{o=await e.json()}catch(t){o=null}const i={timestampUtc:s,responseData:o,status:r.status,statusText:r.statusText,url:t.url};let{apiHttpSuccess:a}=await(0,u.S7)(u.lP.ApiHttpSuccess);a||(a={}),await(0,u._5)({apiHttpSuccess:{...a,[t.url]:i}})}return r}],beforeError:[async t=>{const{request:e,response:r,message:s}=t,o=r.clone(),i=e.clone();let a=null,c=null;try{a=await i.json(),c=await o.json()}catch{a=null,c=null}const h={timestampUtc:n().utc().format(),message:s,errorData:c,status:o.status,statusText:o.statusText,requestData:a};let{apiHttpErrors:f}=await(0,u.S7)(u.lP.ApiHttpErrors);return f||(f={}),await(0,u._5)({apiHttpErrors:{...f,[o.url]:h}}),t}]}})},4126:(t,e,r)=>{"use strict";r(2296)},5772:(t,e,r)=>{"use strict";r(2296)},8467:(t,e,r)=>{"use strict";r.d(e,{E:()=>s});let s=function(t){return t.FailedVideoOpen="FAILED_VIDEO_OPEN",t.DirectVideoOpen="DIRECT_VIDEO_OPEN",t.ShowPageLoader="SHOW_PAGE_LOADER",t.VideoOpenerReady="VIDEO_OPENER_READY",t.NetworkConnectionRetry="NETWORK_CONNECTION_RETRY",t.NetworkConnectionRetrySuccess="NETWORK_CONNECTION_RETRY_SUCCESS",t.NetworkConnectionRetryFail="NETWORK_CONNECTION_RETRY_FAIL",t.UpdateProxyData="UPDATE_PROXY_DATA",t.OpenPopup="OPEN_POPUP",t.OpenPopupPayment="OPEN_POPUP_PAYMENT",t.NavigateToFreeTrial="NAVIGATE_TO_FREE_TRIAL",t.NavigateToPayment="NAVIGATE_TO_PAYMENT",t.PopupReady="POPUP_READY",t}({})},1735:(t,e,r)=>{"use strict";r.d(e,{LocalStoragePremiumKey:()=>s,getLocalStoragePremiumData:()=>n}),r(5772),r(2718),r(7036),r(9813);let s=function(t){return t.UserId="userId",t.DaysLeft="daysLeft",t.HasPremium="hasPremium",t.PaidUntil="paidUntil",t.SecondsLeft="secondsLeft",t.Status="status",t.IsSubscriptionInfoError="isSubscriptionInfoError",t.IsChangeDeviceError="isChangeDeviceError",t.HasUsedTrial="hasUsedTrial",t.IsAdBannerShown="isAdBannerShown",t}({});async function n(t){return Array.isArray(t),chrome.storage.local.get(t)}},9813:(t,e,r)=>{},2718:(t,e,r)=>{"use strict";r(4126),r(7036)},7036:(t,e,r)=>{"use strict";r.d(e,{S7:()=>n,_5:()=>o,lP:()=>s});let s=function(t){return t.IsProxyControlledByOtherExtensions="isProxyControlledByOtherExtensions",t.PopupWasOpened="popupWasOpened",t.MetaApiData="metaApiData",t.IsNetworkError="isNetworkError",t.ConnectRetryFailed="connectRetryFailed",t.LastProxyHost="lastProxyHost",t.LastProxyPort="lastProxyPort",t.IsInitialized="isInitialized",t.ApiHttpErrors="apiHttpErrors",t.ApiHttpSuccess="apiHttpSuccess",t.BrowserProxySettings="browserProxySettings",t.RequestBlockedError="requestBlockedError",t}({});async function n(t){return Array.isArray(t),chrome.storage.session.get(t)}async function o(t){await chrome.storage.session.set(t)}},7302:(t,e,r)=>{"use strict";r.a(t,(async(t,e)=>{try{var s=r(1735),n=r(8467);if("https://storage.googleapis.com/uboost/success/index.html"===location.origin+location.pathname){const c=document.getElementsByClassName("paidpremiumid")[0].firstChild;if(c instanceof HTMLDivElement){const{userId:h}=await(0,s.getLocalStoragePremiumData)(s.LocalStoragePremiumKey.UserId);h&&(c.innerText=h)}}const o=document.getElementsByClassName("premiumpayment");for(const f of o){const l=f.querySelector("a");l instanceof HTMLAnchorElement&&l.addEventListener("click",u)}const i=document.getElementsByClassName("freetrialwebclick");for(const d of i){const p=d.querySelector("a");p instanceof HTMLAnchorElement&&p.addEventListener("click",a)}async function a(t){t.preventDefault(),t.stopPropagation();const{hasPremium:e}=await(0,s.getLocalStoragePremiumData)(s.LocalStoragePremiumKey.HasPremium);e||await chrome.runtime.sendMessage({action:n.E.OpenPopup})}async function u(t){t.preventDefault(),t.stopPropagation(),await chrome.runtime.sendMessage({action:n.E.OpenPopupPayment})}e()}catch(y){e(y)}}),1)},6286:()=>{},4542:function(t){t.exports=function(){"use strict";var t=6e4,e=36e5,r="millisecond",s="second",n="minute",o="hour",i="day",a="week",u="month",c="quarter",h="year",f="date",l="Invalid Date",d=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,p=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,y={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],r=t%100;return"["+t+(e[(r-20)%10]||e[r]||e[0])+"]"}},m=function(t,e,r){var s=String(t);return!s||s.length>=e?t:""+Array(e+1-s.length).join(r)+t},g={s:m,z:function(t){var e=-t.utcOffset(),r=Math.abs(e),s=Math.floor(r/60),n=r%60;return(e<=0?"+":"-")+m(s,2,"0")+":"+m(n,2,"0")},m:function t(e,r){if(e.date()<r.date())return-t(r,e);var s=12*(r.year()-e.year())+(r.month()-e.month()),n=e.clone().add(s,u),o=r-n<0,i=e.clone().add(s+(o?-1:1),u);return+(-(s+(r-n)/(o?n-i:i-n))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:u,y:h,w:a,d:i,D:f,h:o,m:n,s,ms:r,Q:c}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},_="en",w={};w[_]=y;var $="$isDayjsObject",b=function(t){return t instanceof D||!(!t||!t[$])},T=function t(e,r,s){var n;if(!e)return _;if("string"==typeof e){var o=e.toLowerCase();w[o]&&(n=o),r&&(w[o]=r,n=o);var i=e.split("-");if(!n&&i.length>1)return t(i[0])}else{var a=e.name;w[a]=e,n=a}return!s&&n&&(_=n),n||!s&&_},v=function(t,e){if(b(t))return t.clone();var r="object"==typeof e?e:{};return r.date=t,r.args=arguments,new D(r)},S=g;S.l=T,S.i=b,S.w=function(t,e){return v(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var D=function(){function y(t){this.$L=T(t.locale,null,!0),this.parse(t),this.$x=this.$x||t.x||{},this[$]=!0}var m=y.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,r=t.utc;if(null===e)return new Date(NaN);if(S.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var s=e.match(d);if(s){var n=s[2]-1||0,o=(s[7]||"0").substring(0,3);return r?new Date(Date.UTC(s[1],n,s[3]||1,s[4]||0,s[5]||0,s[6]||0,o)):new Date(s[1],n,s[3]||1,s[4]||0,s[5]||0,s[6]||0,o)}}return new Date(e)}(t),this.init()},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},m.$utils=function(){return S},m.isValid=function(){return!(this.$d.toString()===l)},m.isSame=function(t,e){var r=v(t);return this.startOf(e)<=r&&r<=this.endOf(e)},m.isAfter=function(t,e){return v(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<v(t)},m.$g=function(t,e,r){return S.u(t)?this[e]:this.set(r,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var r=this,c=!!S.u(e)||e,l=S.p(t),d=function(t,e){var s=S.w(r.$u?Date.UTC(r.$y,e,t):new Date(r.$y,e,t),r);return c?s:s.endOf(i)},p=function(t,e){return S.w(r.toDate()[t].apply(r.toDate("s"),(c?[0,0,0,0]:[23,59,59,999]).slice(e)),r)},y=this.$W,m=this.$M,g=this.$D,_="set"+(this.$u?"UTC":"");switch(l){case h:return c?d(1,0):d(31,11);case u:return c?d(1,m):d(0,m+1);case a:var w=this.$locale().weekStart||0,$=(y<w?y+7:y)-w;return d(c?g-$:g+(6-$),m);case i:case f:return p(_+"Hours",0);case o:return p(_+"Minutes",1);case n:return p(_+"Seconds",2);case s:return p(_+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,e){var a,c=S.p(t),l="set"+(this.$u?"UTC":""),d=(a={},a[i]=l+"Date",a[f]=l+"Date",a[u]=l+"Month",a[h]=l+"FullYear",a[o]=l+"Hours",a[n]=l+"Minutes",a[s]=l+"Seconds",a[r]=l+"Milliseconds",a)[c],p=c===i?this.$D+(e-this.$W):e;if(c===u||c===h){var y=this.clone().set(f,1);y.$d[d](p),y.init(),this.$d=y.set(f,Math.min(this.$D,y.daysInMonth())).$d}else d&&this.$d[d](p);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[S.p(t)]()},m.add=function(r,c){var f,l=this;r=Number(r);var d=S.p(c),p=function(t){var e=v(l);return S.w(e.date(e.date()+Math.round(t*r)),l)};if(d===u)return this.set(u,this.$M+r);if(d===h)return this.set(h,this.$y+r);if(d===i)return p(1);if(d===a)return p(7);var y=(f={},f[n]=t,f[o]=e,f[s]=1e3,f)[d]||1,m=this.$d.getTime()+r*y;return S.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,r=this.$locale();if(!this.isValid())return r.invalidDate||l;var s=t||"YYYY-MM-DDTHH:mm:ssZ",n=S.z(this),o=this.$H,i=this.$m,a=this.$M,u=r.weekdays,c=r.months,h=r.meridiem,f=function(t,r,n,o){return t&&(t[r]||t(e,s))||n[r].slice(0,o)},d=function(t){return S.s(o%12||12,t,"0")},y=h||function(t,e,r){var s=t<12?"AM":"PM";return r?s.toLowerCase():s};return s.replace(p,(function(t,s){return s||function(t){switch(t){case"YY":return String(e.$y).slice(-2);case"YYYY":return S.s(e.$y,4,"0");case"M":return a+1;case"MM":return S.s(a+1,2,"0");case"MMM":return f(r.monthsShort,a,c,3);case"MMMM":return f(c,a);case"D":return e.$D;case"DD":return S.s(e.$D,2,"0");case"d":return String(e.$W);case"dd":return f(r.weekdaysMin,e.$W,u,2);case"ddd":return f(r.weekdaysShort,e.$W,u,3);case"dddd":return u[e.$W];case"H":return String(o);case"HH":return S.s(o,2,"0");case"h":return d(1);case"hh":return d(2);case"a":return y(o,i,!0);case"A":return y(o,i,!1);case"m":return String(i);case"mm":return S.s(i,2,"0");case"s":return String(e.$s);case"ss":return S.s(e.$s,2,"0");case"SSS":return S.s(e.$ms,3,"0");case"Z":return n}return null}(t)||n.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,f,l){var d,p=this,y=S.p(f),m=v(r),g=(m.utcOffset()-this.utcOffset())*t,_=this-m,w=function(){return S.m(p,m)};switch(y){case h:d=w()/12;break;case u:d=w();break;case c:d=w()/3;break;case a:d=(_-g)/6048e5;break;case i:d=(_-g)/864e5;break;case o:d=_/e;break;case n:d=_/t;break;case s:d=_/1e3;break;default:d=_}return l?d:S.a(d)},m.daysInMonth=function(){return this.endOf(u).$D},m.$locale=function(){return w[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var r=this.clone(),s=T(t,e,!0);return s&&(r.$L=s),r},m.clone=function(){return S.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},y}(),E=D.prototype;return v.prototype=E,[["$ms",r],["$s",s],["$m",n],["$H",o],["$W",i],["$M",u],["$y",h],["$D",f]].forEach((function(t){E[t[1]]=function(e){return this.$g(e,t[0],t[1])}})),v.extend=function(t,e){return t.$i||(t(e,D,v),t.$i=!0),v},v.locale=T,v.isDayjs=b,v.unix=function(t){return v(1e3*t)},v.en=w[_],v.Ls=w,v.p={},v}()},2787:function(t){t.exports=function(){"use strict";var t="minute",e=/[+-]\d\d(?::?\d\d)?/g,r=/([+-]|\d\d)/g;return function(s,n,o){var i=n.prototype;o.utc=function(t){return new n({date:t,utc:!0,args:arguments})},i.utc=function(e){var r=o(this.toDate(),{locale:this.$L,utc:!0});return e?r.add(this.utcOffset(),t):r},i.local=function(){return o(this.toDate(),{locale:this.$L,utc:!1})};var a=i.parse;i.parse=function(t){t.utc&&(this.$u=!0),this.$utils().u(t.$offset)||(this.$offset=t.$offset),a.call(this,t)};var u=i.init;i.init=function(){if(this.$u){var t=this.$d;this.$y=t.getUTCFullYear(),this.$M=t.getUTCMonth(),this.$D=t.getUTCDate(),this.$W=t.getUTCDay(),this.$H=t.getUTCHours(),this.$m=t.getUTCMinutes(),this.$s=t.getUTCSeconds(),this.$ms=t.getUTCMilliseconds()}else u.call(this)};var c=i.utcOffset;i.utcOffset=function(s,n){var o=this.$utils().u;if(o(s))return this.$u?0:o(this.$offset)?c.call(this):this.$offset;if("string"==typeof s&&(s=function(t){void 0===t&&(t="");var s=t.match(e);if(!s)return null;var n=(""+s[0]).match(r)||["-",0,0],o=n[0],i=60*+n[1]+ +n[2];return 0===i?0:"+"===o?i:-i}(s),null===s))return this;var i=Math.abs(s)<=16?60*s:s,a=this;if(n)return a.$offset=i,a.$u=0===s,a;if(0!==s){var u=this.$u?this.toDate().getTimezoneOffset():-1*this.utcOffset();(a=this.local().add(i+u,t)).$offset=i,a.$x.$localOffset=u}else a=this.utc();return a};var h=i.format;i.format=function(t){var e=t||(this.$u?"YYYY-MM-DDTHH:mm:ss[Z]":"");return h.call(this,e)},i.valueOf=function(){var t=this.$utils().u(this.$offset)?0:this.$offset+(this.$x.$localOffset||this.$d.getTimezoneOffset());return this.$d.valueOf()-6e4*t},i.isUTC=function(){return!!this.$u},i.toISOString=function(){return this.toDate().toISOString()},i.toString=function(){return this.toDate().toUTCString()};var f=i.toDate;i.toDate=function(t){return"s"===t&&this.$offset?o(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate():f.call(this)};var l=i.diff;i.diff=function(t,e,r){if(t&&this.$u===t.$u)return l.call(this,t,e,r);var s=this.local(),n=o(t).local();return l.call(s,n,e,r)}}}()},1748:(t,e,r)=>{"use strict";r.d(e,{Ky:()=>f});var s=r(4292),n=r(7547),o=r(390),i=r(8261),a=r(3797),u=r(5409),c=r(1008),h=r(4719);class f{static create(t,e){const r=new f(t,e),n=async()=>{if("number"==typeof r._options.timeout&&r._options.timeout>h.TK)throw new RangeError(`The \`timeout\` option cannot be greater than ${h.TK}`);await Promise.resolve();let t=await r._fetch();for(const e of r._options.hooks.afterResponse){const s=await e(r.request,r._options,r._decorateResponse(t.clone()));s instanceof globalThis.Response&&(t=s)}if(r._decorateResponse(t),!t.ok&&r._options.throwHttpErrors){let e=new s.H(t,r.request,r._options);for(const t of r._options.hooks.beforeError)e=await t(e);throw e}if(r._options.onDownloadProgress){if("function"!=typeof r._options.onDownloadProgress)throw new TypeError("The `onDownloadProgress` option must be a function");if(!h.b0)throw new Error("Streams are not supported in your environment. `ReadableStream` is missing.");return r._stream(t.clone(),r._options.onDownloadProgress)}return t},o=r._options.retry.methods.includes(r.request.method.toLowerCase())?r._retry(n):n();for(const[t,s]of Object.entries(h.hT))o[t]=async()=>{r.request.headers.set("accept",r.request.headers.get("accept")||s);const n=(await o).clone();if("json"===t){if(204===n.status)return"";if(0===(await n.clone().arrayBuffer()).byteLength)return"";if(e.parseJson)return e.parseJson(await n.text())}return n[t]()};return o}request;abortController;_retryCount=0;_input;_options;constructor(t,e={}){if(this._input=t,this._options={...e,headers:(0,o.lF)(this._input.headers,e.headers),hooks:(0,o.XN)({beforeRequest:[],beforeRetry:[],beforeError:[],afterResponse:[]},e.hooks),method:(0,i.q)(e.method??this._input.method),prefixUrl:String(e.prefixUrl||""),retry:(0,i.U)(e.retry),throwHttpErrors:!1!==e.throwHttpErrors,timeout:e.timeout??1e4,fetch:e.fetch??globalThis.fetch.bind(globalThis)},"string"!=typeof this._input&&!(this._input instanceof URL||this._input instanceof globalThis.Request))throw new TypeError("`input` must be a string, URL, or Request");if(this._options.prefixUrl&&"string"==typeof this._input){if(this._input.startsWith("/"))throw new Error("`input` must not begin with a slash when using `prefixUrl`");this._options.prefixUrl.endsWith("/")||(this._options.prefixUrl+="/"),this._input=this._options.prefixUrl+this._input}if(h.xM){this.abortController=new globalThis.AbortController;const t=this._options.signal??this._input.signal;t?.addEventListener("abort",(()=>{this.abortController.abort(t.reason)})),this._options.signal=this.abortController.signal}if(h.xr&&(this._options.duplex="half"),void 0!==this._options.json&&(this._options.body=this._options.stringifyJson?.(this._options.json)??JSON.stringify(this._options.json),this._options.headers.set("content-type",this._options.headers.get("content-type")??"application/json")),this.request=new globalThis.Request(this._input,this._options),this._options.searchParams){const t="?"+("string"==typeof this._options.searchParams?this._options.searchParams.replace(/^\?/,""):new URLSearchParams(this._options.searchParams).toString()),e=this.request.url.replace(/(?:\?.*?)?(?=#|$)/,t);!(h.zq&&this._options.body instanceof globalThis.FormData||this._options.body instanceof URLSearchParams)||this._options.headers&&this._options.headers["content-type"]||this.request.headers.delete("content-type"),this.request=new globalThis.Request(new globalThis.Request(e,{...this.request}),this._options)}}_calculateRetryDelay(t){if(this._retryCount++,this._retryCount>this._options.retry.limit||t instanceof n.M)throw t;if(t instanceof s.H){if(!this._options.retry.statusCodes.includes(t.response.status))throw t;const e=t.response.headers.get("Retry-After")??t.response.headers.get("RateLimit-Reset")??t.response.headers.get("X-RateLimit-Reset")??t.response.headers.get("X-Rate-Limit-Reset");if(e&&this._options.retry.afterStatusCodes.includes(t.response.status)){let t=1e3*Number(e);Number.isNaN(t)?t=Date.parse(e)-Date.now():t>=Date.parse("2024-01-01")&&(t-=Date.now());const r=this._options.retry.maxRetryAfter??t;return t<r?t:r}if(413===t.response.status)throw t}const e=this._options.retry.delay(this._retryCount);return Math.min(this._options.retry.backoffLimit,e)}_decorateResponse(t){return this._options.parseJson&&(t.json=async()=>this._options.parseJson(await t.text())),t}async _retry(t){try{return await t()}catch(e){const r=Math.min(this._calculateRetryDelay(e),h.TK);if(this._retryCount<1)throw e;await(0,u.A)(r,{signal:this._options.signal});for(const t of this._options.hooks.beforeRetry)if(await t({request:this.request,options:this._options,error:e,retryCount:this._retryCount})===h.ds)return;return this._retry(t)}}async _fetch(){for(const t of this._options.hooks.beforeRequest){const e=await t(this.request,this._options);if(e instanceof Request){this.request=e;break}if(e instanceof Response)return e}const t=(0,c.I)(this.request,this._options),e=this.request;return this.request=e.clone(),!1===this._options.timeout?this._options.fetch(e,t):(0,a.A)(e,t,this.abortController,this._options)}_stream(t,e){const r=Number(t.headers.get("content-length"))||0;let s=0;return 204===t.status?(e&&e({percent:1,totalBytes:r,transferredBytes:s},new Uint8Array),new globalThis.Response(null,{status:t.status,statusText:t.statusText,headers:t.headers})):new globalThis.Response(new globalThis.ReadableStream({async start(n){const o=t.body.getReader();e&&e({percent:0,transferredBytes:0,totalBytes:r},new Uint8Array),await async function t(){const{done:i,value:a}=await o.read();i?n.close():(e&&(s+=a.byteLength,e({percent:0===r?0:s/r,transferredBytes:s,totalBytes:r},a)),n.enqueue(a),await t())}()}}),{status:t.status,statusText:t.statusText,headers:t.headers})}}},4719:(t,e,r)=>{"use strict";r.d(e,{E1:()=>a,Pu:()=>l,TK:()=>c,b0:()=>o,ds:()=>h,hT:()=>u,iA:()=>f,xM:()=>n,xr:()=>s,zq:()=>i});const s=(()=>{let t=!1,e=!1;const r="function"==typeof globalThis.ReadableStream,s="function"==typeof globalThis.Request;if(r&&s)try{e=new globalThis.Request("https://empty.invalid",{body:new globalThis.ReadableStream,method:"POST",get duplex(){return t=!0,"half"}}).headers.has("Content-Type")}catch(t){if(t instanceof Error&&"unsupported BodyInit type"===t.message)return!1;throw t}return t&&!e})(),n="function"==typeof globalThis.AbortController,o="function"==typeof globalThis.ReadableStream,i="function"==typeof globalThis.FormData,a=["get","post","put","patch","head","delete"],u={json:"application/json",text:"text/*",formData:"multipart/form-data",arrayBuffer:"*/*",blob:"*/*"},c=2147483647,h=Symbol("stop"),f={json:!0,parseJson:!0,stringifyJson:!0,searchParams:!0,prefixUrl:!0,retry:!0,timeout:!0,hooks:!0,throwHttpErrors:!0,onDownloadProgress:!0,fetch:!0},l={method:!0,headers:!0,body:!0,mode:!0,credentials:!0,cache:!0,redirect:!0,referrer:!0,referrerPolicy:!0,integrity:!0,keepalive:!0,signal:!0,window:!0,dispatcher:!0,duplex:!0,priority:!0}},4292:(t,e,r)=>{"use strict";r.d(e,{H:()=>s});class s extends Error{response;request;options;constructor(t,e,r){const s=`${t.status||0===t.status?t.status:""} ${t.statusText||""}`.trim();super(`Request failed with ${s?`status code ${s}`:"an unknown error"}: ${e.method} ${e.url}`),this.name="HTTPError",this.response=t,this.request=e,this.options=r}}},7547:(t,e,r)=>{"use strict";r.d(e,{M:()=>s});class s extends Error{request;constructor(t){super(`Request timed out: ${t.method} ${t.url}`),this.name="TimeoutError",this.request=t}}},3036:(t,e,r)=>{"use strict";r.d(e,{Ay:()=>a});var s=r(1748),n=r(4719),o=r(390);const i=t=>{const e=(e,r)=>s.Ky.create(e,(0,o.sT)(t,r));for(const r of n.E1)e[r]=(e,n)=>s.Ky.create(e,(0,o.sT)(t,n,{method:r}));return e.create=t=>i((0,o.sT)(t)),e.extend=e=>("function"==typeof e&&(e=e(t??{})),i((0,o.sT)(t,e))),e.stop=n.ds,e},a=i()},5409:(t,e,r)=>{"use strict";async function s(t,{signal:e}){return new Promise(((r,s)=>{function n(){clearTimeout(o),s(e.reason)}e&&(e.throwIfAborted(),e.addEventListener("abort",n,{once:!0}));const o=setTimeout((()=>{e?.removeEventListener("abort",n),r()}),t)}))}r.d(e,{A:()=>s})},4912:(t,e,r)=>{"use strict";r.d(e,{G:()=>s});const s=t=>null!==t&&"object"==typeof t},390:(t,e,r)=>{"use strict";r.d(e,{XN:()=>a,lF:()=>o,sT:()=>n});var s=r(4912);const n=(...t)=>{for(const e of t)if((!(0,s.G)(e)||Array.isArray(e))&&void 0!==e)throw new TypeError("The `options` argument must be an object");return u({},...t)},o=(t={},e={})=>{const r=new globalThis.Headers(t),s=e instanceof globalThis.Headers,n=new globalThis.Headers(e);for(const[t,e]of n.entries())s&&"undefined"===e||void 0===e?r.delete(t):r.set(t,e);return r};function i(t,e,r){return Object.hasOwn(e,r)&&void 0===e[r]?[]:u(t[r]??[],e[r]??[])}const a=(t={},e={})=>({beforeRequest:i(t,e,"beforeRequest"),beforeRetry:i(t,e,"beforeRetry"),afterResponse:i(t,e,"afterResponse"),beforeError:i(t,e,"beforeError")}),u=(...t)=>{let e={},r={},n={};for(const i of t)if(Array.isArray(i))Array.isArray(e)||(e=[]),e=[...e,...i];else if((0,s.G)(i)){for(let[t,r]of Object.entries(i))(0,s.G)(r)&&t in e&&(r=u(e[t],r)),e={...e,[t]:r};(0,s.G)(i.hooks)&&(n=a(n,i.hooks),e.hooks=n),(0,s.G)(i.headers)&&(r=o(r,i.headers),e.headers=r)}return e}},8261:(t,e,r)=>{"use strict";r.d(e,{U:()=>i,q:()=>n});var s=r(4719);const n=t=>s.E1.includes(t)?t.toUpperCase():t,o={limit:2,methods:["get","put","head","delete","options","trace"],statusCodes:[408,413,429,500,502,503,504],afterStatusCodes:[413,429,503],maxRetryAfter:Number.POSITIVE_INFINITY,backoffLimit:Number.POSITIVE_INFINITY,delay:t=>.3*2**(t-1)*1e3},i=(t={})=>{if("number"==typeof t)return{...o,limit:t};if(t.methods&&!Array.isArray(t.methods))throw new Error("retry.methods must be an array");if(t.statusCodes&&!Array.isArray(t.statusCodes))throw new Error("retry.statusCodes must be an array");return{...o,...t}}},1008:(t,e,r)=>{"use strict";r.d(e,{I:()=>n});var s=r(4719);const n=(t,e)=>{const r={};for(const n in e)n in s.Pu||n in s.iA||n in t||(r[n]=e[n]);return r}},3797:(t,e,r)=>{"use strict";r.d(e,{A:()=>n});var s=r(7547);async function n(t,e,r,n){return new Promise(((o,i)=>{const a=setTimeout((()=>{r&&r.abort(),i(new s.M(t))}),n.timeout);n.fetch(t,e).then(o).catch(i).then((()=>{clearTimeout(a)}))}))}}},o={};function i(t){var e=o[t];if(void 0!==e)return e.exports;var r=o[t]={exports:{}};return n[t].call(r.exports,r,r.exports,i),r.exports}t="function"==typeof Symbol?Symbol("webpack queues"):"__webpack_queues__",e="function"==typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",r="function"==typeof Symbol?Symbol("webpack error"):"__webpack_error__",s=t=>{t&&t.d<1&&(t.d=1,t.forEach((t=>t.r--)),t.forEach((t=>t.r--?t.r++:t())))},i.a=(n,o,i)=>{var a;i&&((a=[]).d=-1);var u,c,h,f=new Set,l=n.exports,d=new Promise(((t,e)=>{h=e,c=t}));d[e]=l,d[t]=t=>(a&&t(a),f.forEach(t),d.catch((t=>{}))),n.exports=d,o((n=>{var o;u=(n=>n.map((n=>{if(null!==n&&"object"==typeof n){if(n[t])return n;if(n.then){var o=[];o.d=0,n.then((t=>{i[e]=t,s(o)}),(t=>{i[r]=t,s(o)}));var i={};return i[t]=t=>t(o),i}}var a={};return a[t]=t=>{},a[e]=n,a})))(n);var i=()=>u.map((t=>{if(t[r])throw t[r];return t[e]})),c=new Promise((e=>{(o=()=>e(i)).r=0;var r=t=>t!==a&&!f.has(t)&&(f.add(t),t&&!t.d&&(o.r++,t.push(o)));u.map((e=>e[t](r)))}));return o.r?c:i()}),(t=>(t?h(d[r]=t):c(l),s(a)))),a&&a.d<0&&(a.d=0)},i.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return i.d(e,{a:e}),e},i.d=(t,e)=>{for(var r in e)i.o(e,r)&&!i.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},i.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),i(7302),i(6286)})();