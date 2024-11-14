var background=function(){"use strict";var xe,be,we,ye,ve,ke,Te,Ee,Se,Ce;function _e(e){return e==null||typeof e=="function"?{main:e}:e}const Me=/^(https?|wss?|file|ftp|\*):\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$|^file:\/\/\/.*$|^resource:\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$|^about:/,re=(xe=globalThis.navigator)==null?void 0:xe.userAgent.includes("Firefox/"),Le=re?/^(https?|wss?):[/][/][^/]+([/].*)?$/:/^https?:[/][/][^/]+([/].*)?$/,Re=/^(https?|file|ftp):[/]+/;function $e(e){if(!je(e))throw new Error(e+" is an invalid pattern. See https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns for more info.")}function je(e){return e==="<all_urls>"||Me.test(e)}function Ne(e){$e(e);let[,r,n="",s]=e.split(/(^[^:]+:[/][/])([^/]+)?/);return r=r.replace("*",re?"(https?|wss?)":"https?").replaceAll(/[/]/g,"[/]"),n==="*"&&(n="[^/]+"),n&&(n=n.replace(/^[*][.]/,"([^/]+.)*").replaceAll(/[.]/g,"[.]").replace(/[*]$/,"[^.]+")),s=s.replaceAll(/[/]/g,"[/]").replaceAll(/[.]/g,"[.]").replaceAll(/[*]/g,".*"),"^"+r+n+"("+s+")?$"}function _(...e){return e.length===0?/$./:e.includes("<all_urls>")?Re:e.includes("*://*/*")?Le:new RegExp(e.map(r=>Ne(r)).join("|"))}function Oe(e){return e.includes("<all_urls>")?["<all_urls>"]:e.includes("*://*/*")?["*://*/*"]:e.filter(r=>!e.some(n=>r!==n&&_(n).test(r)))}function ne(e=chrome.runtime.getManifest()){var s;const r={origins:[],permissions:[]},n=new Set([...e.permissions??[],...e.host_permissions??[],...(e.content_scripts??[]).flatMap(t=>t.matches??[])]);e.devtools_page&&!((s=e.optional_permissions)!=null&&s.includes("devtools"))&&n.add("devtools");for(const t of n)t.includes("://")||t==="<all_urls>"?r.origins.push(t):r.permissions.push(t);return Ie(r)}const Fe=/:[/][/][*.]*([^/]+)/;function te(e){return e.split(Fe)[1]}async function Ue(e){return new Promise(r=>{chrome.permissions.getAll(n=>{r(Be(n,e))})})}function Be(e,{manifest:r,strictOrigins:n=!0}={}){const s=ne(r),t={origins:[],permissions:[]};for(const i of e.origins??[])if(!s.origins.includes(i)){if(!n){const c=te(i);if(s.origins.some(f=>te(f)===c))continue}t.origins.push(i)}for(const i of e.permissions??[])s.permissions.includes(i)||t.permissions.push(i);return t}function ze(e,r=chrome.runtime.getManifest()){const n=ne(r);return _(...n.origins).test(e)}function Ie({origins:e,permissions:r}){return{origins:e?Oe(e):[],permissions:r?[...r]:[]}}function z(e){if(!e)return!1;try{const{pathname:r}=new URL(e,location.origin);return r===location.pathname}catch{return!1}}function N(e){var r,n,s;return(s=(n=(r=globalThis.chrome)==null?void 0:r.runtime)==null?void 0:n.getManifest)==null?void 0:s.call(n)}function I(e){let r;return()=>(r===void 0&&(r=e()),r)}const De=()=>D()||se(),D=I(()=>{var r,n;const e=N();return e&&z(e.background_page??((r=e.background)==null?void 0:r.page))?!0:!!((n=e==null?void 0:e.background)!=null&&n.scripts&&z("/_generated_background_page.html"))}),se=I(()=>{var e,r;return z((r=(e=N())==null?void 0:e.background)==null?void 0:r.service_worker)}),We=I(()=>{var e,r,n;return D()&&((e=N())==null?void 0:e.manifest_version)===2&&((n=(r=N())==null?void 0:r.background)==null?void 0:n.persistent)!==!1}),W=()=>{var e;return(e=globalThis.navigator)==null?void 0:e.userAgent.includes("Chrome")},q="__webext-events__startup",M=new EventTarget;let ie=!1,oe=!1;const L=((be=globalThis.browser)==null?void 0:be.storage)??((we=globalThis.chrome)==null?void 0:we.storage);async function qe(){if(ie=!0,!oe)return;if(We()){M.dispatchEvent(new Event("extension-start"));return}if(!(L!=null&&L.session)){W()&&chrome.runtime.getManifest().manifest_version===2?console.warn("onExtensionStart is unable to determine whether it’s being run for the first time on MV2 Event Pages in Chrome. It will run the listeners anyway."):console.warn("onExtensionStart is unable to determine whether it’s being run for the first time without the `storage` permission. It will run the listeners anyway"),M.dispatchEvent(new Event("extension-start"));return}const e=await L.session.get(q);q in e||(await L.session.set({[q]:!0}),M.dispatchEvent(new Event("extension-start")))}const Ve=Object.freeze({addListener(e){ie?console.warn("onExtensionStart.addListener() was called after the extension started. The callback will not be called."):(oe=!0,M.addEventListener("extension-start",e))},removeListener(e){M.removeEventListener("extension-start",e)}});setTimeout(qe,2);async function He(e,{filter:r,signal:n}={}){n!=null&&n.aborted||await new Promise(s=>{const t=(...i)=>{(!r||r(...i))&&(s(),e.removeListener(t))};e.addListener(t),n==null||n.addEventListener("abort",()=>{s(),e.removeListener(t)})})}function Ze(e){return JSON.stringify([e.all_frames,e.exclude_matches,e.run_at])}function Ge(e,{warn:r=!0}={}){const n=new Map,s=(t,i)=>t?t.filter(c=>{const u=Ze(i);return n.has(c)?(r&&u!==n.get(c)&&console.warn(`Duplicate file in the manifest content_scripts: ${c} 
More info: https://github.com/fregante/webext-dynamic-content-scripts/issues/62`),!1):(n.set(c,u),!0)}):[];return e.flatMap(t=>{const{matches:i,...c}=t,u={...c,js:s(t.js,t),css:s(t.css,t)};return u.css.length+u.js.length===0?[]:u})}function ae(e){return new Proxy(e,{get(r,n){if(r[n])return typeof r[n]!="function"?new ae(r[n]):(...s)=>new Promise((t,i)=>{r[n](...s,c=>{chrome.runtime.lastError?i(new Error(chrome.runtime.lastError.message)):t(c)})})}})}const k=globalThis.chrome&&new ae(globalThis.chrome),V=!!((ye=globalThis.chrome)!=null&&ye.scripting);function Je(e){return typeof e=="object"?e:{tabId:e,frameId:0}}function Ke(e){return typeof e=="object"?{...e,allFrames:!1}:{tabId:e,frameId:void 0,allFrames:!0}}function ce(e){return Array.isArray(e)?e:[e]}const Qe=/^function \w+\(\) {[\n\s]+\[native code][\n\s]+}/;async function H(e,r,...n){if(Qe.test(String(r)))throw new TypeError("Native functions need to be wrapped first, like `executeFunction(1, () => alert(1))`");const{frameId:s,tabId:t}=Je(e);if(V){const[c]=await chrome.scripting.executeScript({target:{tabId:t,frameIds:[s]},func:r,args:n});return c==null?void 0:c.result}const[i]=await k.tabs.executeScript(t,{code:`(${r.toString()})(...${JSON.stringify(n)})`,matchAboutBlank:!0,frameId:s});return i}function le(e){return e===void 0?void 0:[e]}async function Xe({tabId:e,frameId:r,files:n,allFrames:s,matchAboutBlank:t,runAt:i},{ignoreTargetErrors:c}={}){const u=Promise.all(n.map(async f=>(typeof f=="string"&&(f={file:f}),V?chrome.scripting.insertCSS({target:{tabId:e,frameIds:le(r),allFrames:r===void 0?s:void 0},files:"file"in f?[f.file]:void 0,css:"code"in f?f.code:void 0}):k.tabs.insertCSS(e,{...f,matchAboutBlank:t,allFrames:s,frameId:r,runAt:i??"document_start"}))));c?await Z(u):await u}function Ye(e){if(e.some(r=>"code"in r))throw new Error("chrome.scripting does not support injecting strings of `code`")}async function er({tabId:e,frameId:r,files:n,allFrames:s,matchAboutBlank:t,runAt:i},{ignoreTargetErrors:c}={}){const u=n.map(h=>typeof h=="string"?{file:h}:h);if(V){Ye(u);const h=chrome.scripting.executeScript({target:{tabId:e,frameIds:le(r),allFrames:r===void 0?s:void 0},files:u.map(({file:T})=>T)});c?await Z(h):await h;return}const f=[];for(const h of u)"code"in h&&await f.at(-1),f.push(k.tabs.executeScript(e,{...h,matchAboutBlank:t,allFrames:s,frameId:r,runAt:i}));c?await Z(Promise.all(f)):await Promise.all(f)}async function rr(e,r){if(e.length===0)return[];const n=r?_(...r):void 0;return(await k.tabs.query({url:e})).filter(t=>t.id&&t.url&&(n?!n.test(t.url):!0)).map(t=>t.id)}async function me(e,r,n={}){const s=ce(e);await Promise.all(s.map(async t=>nr(Ke(t),r,n)))}async function nr({frameId:e,tabId:r,allFrames:n},s,t={}){const i=ce(s).flatMap(c=>[Xe({tabId:r,frameId:e,allFrames:n,files:c.css??[],matchAboutBlank:c.matchAboutBlank??c.match_about_blank,runAt:c.runAt??c.run_at},t),er({tabId:r,frameId:e,allFrames:n,files:c.js??[],matchAboutBlank:c.matchAboutBlank??c.match_about_blank,runAt:c.runAt??c.run_at},t)]);await Promise.all(i)}const tr=["chrome.google.com/webstore","chromewebstore.google.com","accounts-static.cdn.mozilla.net","accounts.firefox.com","addons.cdn.mozilla.net","addons.mozilla.org","api.accounts.firefox.com","content.cdn.mozilla.net","discovery.addons.mozilla.org","input.mozilla.org","install.mozilla.org","oauth.accounts.firefox.com","profile.accounts.firefox.com","support.mozilla.org","sync.services.mozilla.com","testpilot.firefox.com"];function ge(e){if(!(e!=null&&e.startsWith("http")))return!1;const r=e.replace(/^https?:\/\//,"");return tr.every(n=>!r.startsWith(n))}const sr=/^No frame with id \d+ in tab \d+.$|^No tab with id: \d+.$|^The tab was closed.$|^The frame was removed.$/;async function Z(e){try{await e}catch(r){if(!sr.test(r==null?void 0:r.message))throw r}}async function ir(e,r){const n=r.flatMap(s=>s.matches??[]);return me(await rr(e,n),r,{ignoreTargetErrors:!0})}const or="Type error for parameter contentScriptOptions (Error processing matches: Array requires at least 1 items; you have 0) for contentScripts.register.",ar="Permission denied to register a content script for ",G=typeof chrome=="object"&&"webNavigation"in chrome;async function cr(e){return k.permissions.contains({origins:[new URL(e).origin+"/*"]})}async function lr(e,r){const{js:n=[],css:s=[],matchAboutBlank:t,matches:i=[],excludeMatches:c,runAt:u}=e;let{allFrames:f}=e;if(G?f=!1:f&&console.warn("`allFrames: true` requires the `webNavigation` permission to work correctly: https://github.com/fregante/content-scripts-register-polyfill#permissions"),i.length===0)throw new Error(or);await Promise.all(i.map(async p=>{if(!await k.permissions.contains({origins:[p]}))throw new Error(ar+p)}));const h=_(...i),T=_(...c??[]),B=async(p,C,v=0)=>{!h.test(p)||T.test(p)||!await cr(p)||await me({tabId:C,frameId:v},{css:s,js:n,matchAboutBlank:t,runAt:u},{ignoreTargetErrors:!0})},R=async(p,{status:C},{url:v})=>{C==="loading"&&v&&B(v,p)},S=async({tabId:p,frameId:C,url:v})=>{B(v,p,C)};return G?chrome.webNavigation.onCommitted.addListener(S):chrome.tabs.onUpdated.addListener(R),{async unregister(){G?chrome.webNavigation.onCommitted.removeListener(S):chrome.tabs.onUpdated.removeListener(R)}}}const ue=(ke=(ve=globalThis.chrome)==null?void 0:ve.scripting)==null?void 0:ke.registerContentScripts,fe=(Ee=(Te=globalThis.browser)==null?void 0:Te.contentScripts)==null?void 0:Ee.register;async function mr(e){var n,s;if(ue){const t="webext-dynamic-content-script-"+JSON.stringify(e);try{await ue([{...e,id:t}])}catch(i){if(!(i!=null&&i.message.startsWith("Duplicate script ID")))throw i}return{unregister:async()=>chrome.scripting.unregisterContentScripts({ids:[t]})}}const r={...e,js:(n=e.js)==null?void 0:n.map(t=>({file:t})),css:(s=e.css)==null?void 0:s.map(t=>({file:t}))};return fe?fe(r):lr(r)}const de=new Map;function Ae(e){return new URL(e,location.origin).pathname}function gr(){const{content_scripts:e,manifest_version:r}=chrome.runtime.getManifest();if(!e)throw new Error("webext-dynamic-content-scripts tried to register scripts on the new host permissions, but no content scripts were found in the manifest.");return Ge(e,{warn:r===2})}async function ur(e,r){var n,s;if(e.length!==0)for(const t of e)for(const i of r){const c=mr({js:(n=i.js)==null?void 0:n.map(u=>Ae(u)),css:(s=i.css)==null?void 0:s.map(u=>Ae(u)),allFrames:i.all_frames,matches:[t],excludeMatches:i.matches,runAt:i.run_at});de.set(t,c)}}async function fr({origins:e}){await he(e)}async function dr({origins:e}){if(e!=null&&e.length)for(const[r,n]of de)e.includes(r)&&(await n).unregister()}async function he(e){if(!(e!=null&&e.length))return;const r=gr();await Promise.all([ir(e,r),ur(e,r)])}async function Ar(){const{origins:e}=await Ue({strictOrigins:!1});await he(e)}function hr(){chrome.permissions.onRemoved.addListener(dr),chrome.permissions.onAdded.addListener(fr),Ve.addListener(Ar)}hr();function pr(e){return typeof e=="object"?e:{tabId:e,frameId:0}}async function J(e){const{frameId:r,tabId:n}=pr(e);try{if(r===0&&"tabs"in globalThis.chrome){const s=await k.tabs.get(n);if(s.url)return s.url}return await H(e,()=>location.href)}catch{return}}async function xr(e){await He(chrome.windows.onRemoved,{filter:r=>r===e})}function br(){const e=document.querySelector("button");e.addEventListener("click",r=>{window.close()}),window.addEventListener("blur",r=>{window.close()}),window.resizeBy(0,document.body.scrollHeight-window.innerHeight),window.moveTo((screen.width-window.outerWidth)/2,(screen.height-window.outerHeight)/2),e.focus()}const wr=`
	/*! https://npm.im/webext-base-css */

	/* Chrome only: -webkit-hyphens */
	/* Safari only: _::-webkit-full-page-media */

	/* webpackIgnore: true */
	@import url('chrome://global/skin/in-content/common.css') (min--moz-device-pixel-ratio:0); /* Firefox-only */

	:root {
		--background-color-for-chrome: #292a2d;
		max-width: 700px;
		margin: auto;
	}

	body {
		--body-margin-h: 8px;
		margin-left: var(--body-margin-h);
		margin-right: var(--body-margin-h);
	}

	/* Selector matches Firefox’ */
	input[type='number'],
	input[type='password'],
	input[type='search'],
	input[type='text'],
	input[type='url'],
	input:not([type]),
	textarea {
		display: block;
		box-sizing: border-box;
		margin-left: 0;
		width: 100%;
		resize: vertical;
		-moz-tab-size: 4 !important;
		tab-size: 4 !important;
	}

	input[type='checkbox'] {
		vertical-align: -0.15em;
	}

	@supports (not (-webkit-hyphens:none)) and (not (-moz-appearance:none)) and (list-style-type:'*') {
		textarea:focus {
			/* Inexplicably missing from Chrome’s input style https://github.com/chromium/chromium/blob/6bea0557fe/extensions/renderer/resources/extension.css#L287 */
			border-color: #4d90fe;
			transition: border-color 200ms;
		}
	}

	hr {
		margin-right: calc(-1 * var(--body-margin-h));
		margin-left: calc(-1 * var(--body-margin-h));
		border: none;
		border-bottom: 1px solid #aaa4;
	}

	img {
		vertical-align: middle;
	}

	_::-webkit-full-page-media,
	_:future,
	:root {
		font-family: -apple-system, BlinkMacSystemFont, sans-serif, 'Apple Color Emoji';
	}

	_::-webkit-full-page-media,
	_:future,
	input[type='number'],
	input[type='password'],
	input[type='search'],
	input[type='text'],
	input[type='url'],
	input:not([type]),
	textarea {
		border: solid 1px #888;
		padding: 0.4em;
		font: inherit;
		-webkit-appearance: none;
	}

	@media (prefers-color-scheme: dark) {
		:root {
			color-scheme: dark;
			background-color: var(--background-color-for-chrome);
		}

		body,
		h3 { /* Chrome #3 */
			color: #e8eaed;
		}

		a {
			color: var(--link-color, #8ab4f8);
		}

		a:active {
			color: var(--link-color-active, #b6d3f9);
		}

		input[type='number'],
		input[type='password'],
		input[type='search'],
		input[type='text'],
		input[type='url'],
		input:not([type]),
		textarea {
			color: inherit;
			background-color: transparent;
		}
	}

	/* End webext-base-css */

	body {
		box-sizing: border-box;
		min-height: 100vh;
		margin: 0;
		padding: 1em;
		justify-content: center;
		display: flex;
		flex-direction: column;
		font-size: 14px;
		line-height: 1.5;
		font-family: system, system-ui, sans-serif;
	}

	button {
		margin-top: 1em;
		margin-left: auto;
	}
`;function yr(e=""){return`
		<!doctype html>
		<meta charset="utf-8" />
		<title>${chrome.runtime.getManifest().name}</title>
		<style>${wr}</style>
		<script defer src="alert.js"><\/script>
		<body>
			<main>${e}</main>
			<button>Ok</button>
		</body>
		<script>(${br.toString()})()<\/script>
	`}function vr(e){const r=new URL("https://webext-alert.vercel.app/");return r.searchParams.set("message",e),r.searchParams.set("title",chrome.runtime.getManifest().name),r.href}async function pe(e){return chrome.windows.create({type:"popup",focused:!0,url:e,height:150,width:420})}async function kr(e){const r=await pe("data:text/html,"+encodeURIComponent(yr(e)))??await pe(vr(e));await xr(r.id)}const Tr=se()||!W()&&D()?kr:globalThis.alert??console.log,O="webext-permission-toggle:add-permission";let E;const K=W()&&((Ce=(Se=globalThis.chrome)==null?void 0:Se.runtime)==null?void 0:Ce.getManifest().manifest_version)<3?k:globalThis.chrome;function Er(e){if(!(e!=null&&e.id))throw new Error("The browser didn't supply any information about the active tab.")}function Sr(e){if(!e)throw new Error("The browser didn't supply the current page's URL.")}function Cr(e){if(!ge(e))throw new Error(chrome.runtime.getManifest().name+" can't be enabled on this page.")}async function Pr(e){return K.permissions.contains({origins:[e+"/*"]})}function F({checked:e,enabled:r}){chrome.contextMenus.update(O,{checked:e,enabled:r})}async function Q(e){if(!e){F({enabled:!0,checked:!1});return}if(ge(e)){const{origin:r}=new URL(e),n=ze(e),s=await Pr(r);F({enabled:!n||!s,checked:s});return}F({enabled:!1,checked:!1})}async function _r(e,r){const n={origins:[new URL(e).origin+"/*"]};return await K.permissions[r?"request":"remove"](n),K.permissions.contains(n)}async function Mr({tabId:e}){Q(await J(e)??"")}async function Lr({checked:e,menuItemId:r},n){if(r!==O)return;let s;try{Er(n),s=n.url||await J(n.id),Sr(s),Cr(s);const t=await _r(s,e);t===e||F({checked:t}),t&&E.reloadOnSuccess&&H(n.id,c=>{confirm(c)&&location.reload()},E.reloadOnSuccess)}catch(t){if(setTimeout(Q,500,s),n!=null&&n.id)try{await H(n.id,i=>{window.alert(i)},String(t))}catch{Tr(String(t))}throw t}}function Rr(e){var t;if(!De())throw new Error("webext-permission-toggle can only be called from a background page");if(E)throw new Error("webext-permission-toggle can only be initialized once");const r=chrome.runtime.getManifest();if(!chrome.contextMenus){if(!((t=r.permissions)!=null&&t.includes("contextMenus"))&&!/Android.+Firefox\//.test(navigator.userAgent))throw new Error("webext-permission-toggle requires the `contextMenus` permission");console.warn("chrome.contextMenus is not available");return}E={title:`Enable ${r.name} on this domain`,reloadOnSuccess:!1,...e},E.reloadOnSuccess===!0&&(E.reloadOnSuccess=`Do you want to reload this page to apply ${r.name}?`);const n=[...r.optional_permissions??[],...r.optional_host_permissions??[]].filter(i=>i==="<all_urls>"||i.includes("*"));if(n.length===0)throw new TypeError("webext-permission-toggle requires some wildcard hosts to be specified in `optional_permissions` (MV2) or `optional_host_permissions` (MV3)");chrome.contextMenus.remove(O,()=>chrome.runtime.lastError);const s=r.manifest_version===2?["page_action","browser_action"]:["action"];chrome.contextMenus.create({id:O,type:"checkbox",checked:!1,title:E.title,contexts:s,documentUrlPatterns:n}),chrome.contextMenus.onClicked.addListener(Lr),chrome.tabs.onActivated.addListener(Mr),chrome.tabs.onUpdated.addListener(async(i,{status:c},{url:u,active:f})=>{f&&c==="complete"&&Q(u??await J(i)??"")})}const $r=_e({main(){Rr()}});function Br(){}var jr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Nr={exports:{}};(function(e,r){(function(n,s){s(e)})(typeof globalThis<"u"?globalThis:typeof self<"u"?self:jr,function(n){if(!(globalThis.chrome&&globalThis.chrome.runtime&&globalThis.chrome.runtime.id))throw new Error("This script should only be loaded in a browser extension.");if(globalThis.browser&&globalThis.browser.runtime&&globalThis.browser.runtime.id)n.exports=globalThis.browser;else{const s="The message port closed before a response was received.",t=i=>{const c={alarms:{clear:{minArgs:0,maxArgs:1},clearAll:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getAll:{minArgs:0,maxArgs:0}},bookmarks:{create:{minArgs:1,maxArgs:1},get:{minArgs:1,maxArgs:1},getChildren:{minArgs:1,maxArgs:1},getRecent:{minArgs:1,maxArgs:1},getSubTree:{minArgs:1,maxArgs:1},getTree:{minArgs:0,maxArgs:0},move:{minArgs:2,maxArgs:2},remove:{minArgs:1,maxArgs:1},removeTree:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1},update:{minArgs:2,maxArgs:2}},browserAction:{disable:{minArgs:0,maxArgs:1,fallbackToNoCallback:!0},enable:{minArgs:0,maxArgs:1,fallbackToNoCallback:!0},getBadgeBackgroundColor:{minArgs:1,maxArgs:1},getBadgeText:{minArgs:1,maxArgs:1},getPopup:{minArgs:1,maxArgs:1},getTitle:{minArgs:1,maxArgs:1},openPopup:{minArgs:0,maxArgs:0},setBadgeBackgroundColor:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setBadgeText:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setIcon:{minArgs:1,maxArgs:1},setPopup:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setTitle:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0}},browsingData:{remove:{minArgs:2,maxArgs:2},removeCache:{minArgs:1,maxArgs:1},removeCookies:{minArgs:1,maxArgs:1},removeDownloads:{minArgs:1,maxArgs:1},removeFormData:{minArgs:1,maxArgs:1},removeHistory:{minArgs:1,maxArgs:1},removeLocalStorage:{minArgs:1,maxArgs:1},removePasswords:{minArgs:1,maxArgs:1},removePluginData:{minArgs:1,maxArgs:1},settings:{minArgs:0,maxArgs:0}},commands:{getAll:{minArgs:0,maxArgs:0}},contextMenus:{remove:{minArgs:1,maxArgs:1},removeAll:{minArgs:0,maxArgs:0},update:{minArgs:2,maxArgs:2}},cookies:{get:{minArgs:1,maxArgs:1},getAll:{minArgs:1,maxArgs:1},getAllCookieStores:{minArgs:0,maxArgs:0},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}},devtools:{inspectedWindow:{eval:{minArgs:1,maxArgs:2,singleCallbackArg:!1}},panels:{create:{minArgs:3,maxArgs:3,singleCallbackArg:!0},elements:{createSidebarPane:{minArgs:1,maxArgs:1}}}},downloads:{cancel:{minArgs:1,maxArgs:1},download:{minArgs:1,maxArgs:1},erase:{minArgs:1,maxArgs:1},getFileIcon:{minArgs:1,maxArgs:2},open:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},pause:{minArgs:1,maxArgs:1},removeFile:{minArgs:1,maxArgs:1},resume:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1},show:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0}},extension:{isAllowedFileSchemeAccess:{minArgs:0,maxArgs:0},isAllowedIncognitoAccess:{minArgs:0,maxArgs:0}},history:{addUrl:{minArgs:1,maxArgs:1},deleteAll:{minArgs:0,maxArgs:0},deleteRange:{minArgs:1,maxArgs:1},deleteUrl:{minArgs:1,maxArgs:1},getVisits:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1}},i18n:{detectLanguage:{minArgs:1,maxArgs:1},getAcceptLanguages:{minArgs:0,maxArgs:0}},identity:{launchWebAuthFlow:{minArgs:1,maxArgs:1}},idle:{queryState:{minArgs:1,maxArgs:1}},management:{get:{minArgs:1,maxArgs:1},getAll:{minArgs:0,maxArgs:0},getSelf:{minArgs:0,maxArgs:0},setEnabled:{minArgs:2,maxArgs:2},uninstallSelf:{minArgs:0,maxArgs:1}},notifications:{clear:{minArgs:1,maxArgs:1},create:{minArgs:1,maxArgs:2},getAll:{minArgs:0,maxArgs:0},getPermissionLevel:{minArgs:0,maxArgs:0},update:{minArgs:2,maxArgs:2}},pageAction:{getPopup:{minArgs:1,maxArgs:1},getTitle:{minArgs:1,maxArgs:1},hide:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setIcon:{minArgs:1,maxArgs:1},setPopup:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setTitle:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},show:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0}},permissions:{contains:{minArgs:1,maxArgs:1},getAll:{minArgs:0,maxArgs:0},remove:{minArgs:1,maxArgs:1},request:{minArgs:1,maxArgs:1}},runtime:{getBackgroundPage:{minArgs:0,maxArgs:0},getPlatformInfo:{minArgs:0,maxArgs:0},openOptionsPage:{minArgs:0,maxArgs:0},requestUpdateCheck:{minArgs:0,maxArgs:0},sendMessage:{minArgs:1,maxArgs:3},sendNativeMessage:{minArgs:2,maxArgs:2},setUninstallURL:{minArgs:1,maxArgs:1}},sessions:{getDevices:{minArgs:0,maxArgs:1},getRecentlyClosed:{minArgs:0,maxArgs:1},restore:{minArgs:0,maxArgs:1}},storage:{local:{clear:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}},managed:{get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1}},sync:{clear:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}}},tabs:{captureVisibleTab:{minArgs:0,maxArgs:2},create:{minArgs:1,maxArgs:1},detectLanguage:{minArgs:0,maxArgs:1},discard:{minArgs:0,maxArgs:1},duplicate:{minArgs:1,maxArgs:1},executeScript:{minArgs:1,maxArgs:2},get:{minArgs:1,maxArgs:1},getCurrent:{minArgs:0,maxArgs:0},getZoom:{minArgs:0,maxArgs:1},getZoomSettings:{minArgs:0,maxArgs:1},goBack:{minArgs:0,maxArgs:1},goForward:{minArgs:0,maxArgs:1},highlight:{minArgs:1,maxArgs:1},insertCSS:{minArgs:1,maxArgs:2},move:{minArgs:2,maxArgs:2},query:{minArgs:1,maxArgs:1},reload:{minArgs:0,maxArgs:2},remove:{minArgs:1,maxArgs:1},removeCSS:{minArgs:1,maxArgs:2},sendMessage:{minArgs:2,maxArgs:3},setZoom:{minArgs:1,maxArgs:2},setZoomSettings:{minArgs:1,maxArgs:2},update:{minArgs:1,maxArgs:2}},topSites:{get:{minArgs:0,maxArgs:0}},webNavigation:{getAllFrames:{minArgs:1,maxArgs:1},getFrame:{minArgs:1,maxArgs:1}},webRequest:{handlerBehaviorChanged:{minArgs:0,maxArgs:0}},windows:{create:{minArgs:0,maxArgs:1},get:{minArgs:1,maxArgs:2},getAll:{minArgs:0,maxArgs:1},getCurrent:{minArgs:0,maxArgs:1},getLastFocused:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},update:{minArgs:2,maxArgs:2}}};if(Object.keys(c).length===0)throw new Error("api-metadata.json has not been included in browser-polyfill");class u extends WeakMap{constructor(a,m=void 0){super(m),this.createItem=a}get(a){return this.has(a)||this.set(a,this.createItem(a)),super.get(a)}}const f=o=>o&&typeof o=="object"&&typeof o.then=="function",h=(o,a)=>(...m)=>{i.runtime.lastError?o.reject(new Error(i.runtime.lastError.message)):a.singleCallbackArg||m.length<=1&&a.singleCallbackArg!==!1?o.resolve(m[0]):o.resolve(m)},T=o=>o==1?"argument":"arguments",B=(o,a)=>function(g,...A){if(A.length<a.minArgs)throw new Error(`Expected at least ${a.minArgs} ${T(a.minArgs)} for ${o}(), got ${A.length}`);if(A.length>a.maxArgs)throw new Error(`Expected at most ${a.maxArgs} ${T(a.maxArgs)} for ${o}(), got ${A.length}`);return new Promise((x,b)=>{if(a.fallbackToNoCallback)try{g[o](...A,h({resolve:x,reject:b},a))}catch(l){console.warn(`${o} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `,l),g[o](...A),a.fallbackToNoCallback=!1,a.noCallback=!0,x()}else a.noCallback?(g[o](...A),x()):g[o](...A,h({resolve:x,reject:b},a))})},R=(o,a,m)=>new Proxy(a,{apply(g,A,x){return m.call(A,o,...x)}});let S=Function.call.bind(Object.prototype.hasOwnProperty);const $=(o,a={},m={})=>{let g=Object.create(null),A={has(b,l){return l in o||l in g},get(b,l,w){if(l in g)return g[l];if(!(l in o))return;let d=o[l];if(typeof d=="function")if(typeof a[l]=="function")d=R(o,o[l],a[l]);else if(S(m,l)){let P=B(l,m[l]);d=R(o,o[l],P)}else d=d.bind(o);else if(typeof d=="object"&&d!==null&&(S(a,l)||S(m,l)))d=$(d,a[l],m[l]);else if(S(m,"*"))d=$(d,a[l],m["*"]);else return Object.defineProperty(g,l,{configurable:!0,enumerable:!0,get(){return o[l]},set(P){o[l]=P}}),d;return g[l]=d,d},set(b,l,w,d){return l in g?g[l]=w:o[l]=w,!0},defineProperty(b,l,w){return Reflect.defineProperty(g,l,w)},deleteProperty(b,l){return Reflect.deleteProperty(g,l)}},x=Object.create(o);return new Proxy(x,A)},p=o=>({addListener(a,m,...g){a.addListener(o.get(m),...g)},hasListener(a,m){return a.hasListener(o.get(m))},removeListener(a,m){a.removeListener(o.get(m))}}),C=new u(o=>typeof o!="function"?o:function(m){const g=$(m,{},{getContent:{minArgs:0,maxArgs:0}});o(g)}),v=new u(o=>typeof o!="function"?o:function(m,g,A){let x=!1,b,l=new Promise(j=>{b=function(y){x=!0,j(y)}}),w;try{w=o(m,g,b)}catch(j){w=Promise.reject(j)}const d=w!==!0&&f(w);if(w!==!0&&!d&&!x)return!1;const P=j=>{j.then(y=>{A(y)},y=>{let ee;y&&(y instanceof Error||typeof y.message=="string")?ee=y.message:ee="An unexpected error occurred",A({__mozWebExtensionPolyfillReject__:!0,message:ee})}).catch(y=>{console.error("Failed to send onMessage rejected reply",y)})};return P(d?w:l),!0}),Fr=({reject:o,resolve:a},m)=>{i.runtime.lastError?i.runtime.lastError.message===s?a():o(new Error(i.runtime.lastError.message)):m&&m.__mozWebExtensionPolyfillReject__?o(new Error(m.message)):a(m)},Pe=(o,a,m,...g)=>{if(g.length<a.minArgs)throw new Error(`Expected at least ${a.minArgs} ${T(a.minArgs)} for ${o}(), got ${g.length}`);if(g.length>a.maxArgs)throw new Error(`Expected at most ${a.maxArgs} ${T(a.maxArgs)} for ${o}(), got ${g.length}`);return new Promise((A,x)=>{const b=Fr.bind(null,{resolve:A,reject:x});g.push(b),m.sendMessage(...g)})},Ur={devtools:{network:{onRequestFinished:p(C)}},runtime:{onMessage:p(v),onMessageExternal:p(v),sendMessage:Pe.bind(null,"sendMessage",{minArgs:1,maxArgs:3})},tabs:{sendMessage:Pe.bind(null,"sendMessage",{minArgs:2,maxArgs:3})}},Y={clear:{minArgs:1,maxArgs:1},get:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}};return c.privacy={network:{"*":Y},services:{"*":Y},websites:{"*":Y}},$(i,Ur,c)};n.exports=t(chrome)}})})(Nr);function U(e,...r){}const Or={debug:(...e)=>U(console.debug,...e),log:(...e)=>U(console.log,...e),warn:(...e)=>U(console.warn,...e),error:(...e)=>U(console.error,...e)};let X;try{X=$r.main(),X instanceof Promise&&console.warn("The background's main() function return a promise, but it must be synchronous")}catch(e){throw Or.error("The background crashed on startup!"),e}return X}();
background;
