var L=Object.defineProperty;var A=(c,e,t)=>e in c?L(c,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):c[e]=t;var a=(c,e,t)=>(A(c,typeof e!="symbol"?e+"":e,t),t);import{s as i}from"../common/store.js";import{n as S}from"../common/news.js";import{l as C,v}from"../common/vendor.js";import{c as N}from"../common/logger.js";import{s as y,g as k}from"../common/funcs.js";function D(c){return c.split("").reduce(function(e,t){return e=(e<<5)-e+t.charCodeAt(0),e&e},0)}class I{constructor(){a(this,"logger",N("ExtensionBackground","info"));a(this,"browserActionTimer");a(this,"notificationTimers",{});a(this,"visibleNotificationId",null);a(this,"prevScrobblingTextContent","");a(this,"prevScrobblingCoverUrl","");a(this,"filesDownloadingList",[]);a(this,"isDownloadListenerAdded",!1);a(this,"isNotificationsMuted",!1);this.onTrackChangeDebounced=C(this.onTrackChange.bind(this),500),this.changeStateOrTrackScrobblingHandlerDebounced=C(this.changeStateOrTrackScrobblingHandler.bind(this),250),this.addHotkeysListener(),this.addStateListener(),this.addInstallUpdateHandler(),this.addTabConnectHandler(),this.addNotificationsListener(),this.addScrobbling()}addInstallUpdateHandler(){chrome.runtime.onInstalled.addListener(e=>{var t,n;if(e.reason===chrome.runtime.OnInstalledReason.INSTALL)chrome.runtime.openOptionsPage();else if(e.reason===chrome.runtime.OnInstalledReason.UPDATE&&e.previousVersion!==chrome.runtime.getManifest().version){((t=S[chrome.runtime.getManifest().version])==null?void 0:t.urgent)&&chrome.runtime.openOptionsPage();const o=(n=S[chrome.runtime.getManifest().version])==null?void 0:n.showFnc;o&&typeof o=="function"&&o({settings:i.state.settings})&&chrome.runtime.openOptionsPage()}i.commit("SYNC_SETTINGS")})}addTabConnectHandler(){chrome.runtime.onConnect.addListener(e=>{const t=e.sender.tab;if(t){if(t.url.startsWith("chrome-extension:"))return;i.commit("ADD_TAB",t),i.commit("EVENT_STARTED"),chrome.tabs.update(t.id,{autoDiscardable:!1}),e.onDisconnect.addListener(()=>{i.commit("REMOVE_TAB",t),i.state.tabs.length||(i.commit("EVENT_SHUTDOWN"),i.commit("EVENT_BLUR"))})}})}addHotkeysListener(){chrome.commands.onCommand.addListener(e=>{const t={player_next:"CS_NEXT",player_play:"CS_PLAY",player_prev:"CS_PREV",player_volume_up:"CS_VOLUME_UP",player_volume_down:"CS_VOLUME_DOWN",player_shuffle:"CS_SHUFFLE",player_repeat:"CS_REPEAT",player_seek_fwd:"CS_SEEK_FWD",player_seek_back:"CS_SEEK_BACK",player_dislike:"CS_DISLIKE",player_volume_toggle:"CS_VOLUME_TOGGLE"};if(t[e]){i.commit(t[e]);return}if(e==="player_info"){this.onTrackChange({manual:!0});return}if(e==="player_focus"){const n=this.getMasterTab();this.setActiveTab(n);return}if(e==="player_like"){const{track:n,settings:s}=i.state,{liked:o}=n,{hotkeysAlreadyLikedAction:l}=s;(!o||l==="unlike")&&i.commit("CS_LIKE");return}console.warn("Unknown command:",e)})}onTrackChange({notificationsIgnore:e=!1,manual:t=!1}){try{e||this.trackNotification(t)}catch(n){console.error(n)}}addScrobbling(){i.subscribe(e=>{if(e.type==="@@SYNC_RECONNECT_MUTATION"){this.isNotificationsMuted=!0,setTimeout(()=>{this.isNotificationsMuted=!1},1e3);return}["EVENT_STATE","EVENT_TRACK"].includes(e.type)&&(i.state.settings.scrobbling&&!this.isDownloadListenerAdded&&(chrome.downloads.onChanged.addListener(({id:t,state:n})=>{n&&n.current==="complete"&&(this.filesDownloadingList.includes(t)&&this.filesDownloadingList.splice(this.filesDownloadingList.indexOf(t),1),this.filesDownloadingList.length||chrome.downloads.setShelfEnabled(!0))}),this.isDownloadListenerAdded=!this.isDownloadListenerAdded),this.changeStateOrTrackScrobblingHandlerDebounced(e))})}async changeStateOrTrackScrobblingHandler(e){const{track:t,settings:n}=i.state,{title:s,cover:o,version:l,artists:g}=t,{scrobbling:d,scrobblingFilename:h,scrobblingFormat:u,scrobblingClearOnPause:f,scrobblingSaveCoverSeparate:r,scrobblingCoverFilename:w}=n;if(!d)return;const m=o?o.replace("%%","400x400"):"https://music.yandex.ru/blocks/playlist-cover/playlist-cover_no_cover1.png",b=i.state.isPlaying||!f?y({format:u,artists:g,title:s,version:l,cover:m}):"";if(this.filesDownloadingList.length)return!1;try{if(r){const p=E=>{const T=new FileReader;return T.readAsDataURL(E),new Promise(_=>{T.onloadend=()=>{_(T.result)}})};if(m!==this.prevScrobblingCoverUrl){const T=await(await fetch(m)).blob(),_=await p(T);this.filesDownloadingList.length||chrome.downloads.setShelfEnabled(!1),this.filesDownloadingList.push(await chrome.downloads.download({url:_.replace("/png","/jpeg"),filename:w,conflictAction:"overwrite"})),this.prevScrobblingCoverUrl=m}}b!==this.prevScrobblingTextContent&&(this.filesDownloadingList.length||chrome.downloads.setShelfEnabled(!1),this.filesDownloadingList.push(await chrome.downloads.download({url:"data:text/plain;base64,"+btoa(b.split(`
`).map(p=>unescape(encodeURIComponent(p))).join(`
`)),filename:h,conflictAction:"overwrite"})),this.prevScrobblingTextContent=b)}catch(p){console.error(p)}}trackNotification(e){const{track:t,settings:n}=i.state,{title:s,version:o,cover:l,artists:g,link:d}=t,{notificationAutoCloseTimeout:h,notifications:u}=n;if(!u&&!e||!i.state.isActive||i.state.isFocused&&!e)return;const f=l?l.replace("%%","80x80"):"/assets/playlist-cover_no_cover3.png",r=s,w=k(g),m=o||"",b=D(d)+"";this.createNotification({id:b,title:r,message:w,contextMessage:m,iconUrl:f,timeout:h})}addStateListener(){i.subscribe(e=>{var t;switch(e.type){case"EVENT_STATE":case"EVENT_STARTED":case"EVENT_SHUTDOWN":this.changeBrowserAction();break;case"SETTINGS_SET_KEY":e.payload.key==="browserActionMode"&&this.changeBrowserAction();break;case"BG_OPEN_TAB":this.openNewTab();break;case"EVENT_TRACK":const n=((t=e.payload)==null?void 0:t.notificationsIgnore)??!1;this.onTrackChangeDebounced({notificationsIgnore:n});break}}),this.changeBrowserAction()}openNewTab(){chrome.tabs.create({url:`https://${i.state.settings.newTabUrl||"music.yandex.ru"}`,pinned:i.state.settings.newTabPinned})}async changeBrowserAction(){const{settings:e}=i.state,{browserActionMode:t}=e;t==="popup"||!t?(await chrome.action.setPopup({popup:chrome.runtime.getManifest().action.default_popup}),chrome.action.onClicked.removeListener(this.browserActionClickHandler)):t==="button"&&(await chrome.action.setPopup({popup:""}),chrome.action.onClicked.hasListeners()||chrome.action.onClicked.addListener(this.browserActionClickHandler)),i.state.isActive?i.state.isPlaying?(await chrome.action.setIcon({path:"/assets/icon_38_2_play.png"}),await chrome.action.setTitle({title:"Управление Яндекс.Музыкой: играет"})):i.state.isEmptyPlaylist?(await chrome.action.setIcon({path:"/assets/icon_38_2.png"}),await chrome.action.setTitle({title:"Управление Яндекс.Музыкой: в ожидании"})):(await chrome.action.setIcon({path:"/assets/icon_38_2_pause.png"}),await chrome.action.setTitle({title:"Управление Яндекс.Музыкой: пауза"})):(await chrome.action.setIcon({path:"/assets/icon_38_2_na.png"}),await chrome.action.setTitle({title:"Управление Яндекс.Музыкой: недоступно, нет открытых вкладок"}))}browserActionClickHandler(){if(!i.state.isActive){this.openNewTab();return}this.browserActionTimer?(clearTimeout(this.browserActionTimer),this.browserActionTimer=null,i.commit("CS_NEXT")):this.browserActionTimer=setTimeout(()=>{this.browserActionTimer=null,i.commit("CS_PLAY")},250)}createNotification({id:e=v(),title:t,message:n="",contextMessage:s="",iconUrl:o,type:l="basic",buttons:g=[],timeout:d=0}){return new Promise(async(h,u)=>{if(this.isNotificationsMuted||this.visibleNotificationId===e)return h();if(!i.state.permissions.notification)return u(new Error("Notifications are not granted"));const f={title:t,iconUrl:o,type:l,message:n,buttons:g,contextMessage:s};d===0&&(f.requireInteraction=!0);try{await this.clearNotification({id:e})}catch{}chrome.notifications.create(e,f,r=>{this.visibleNotificationId=r,d>0&&(clearTimeout(this.notificationTimers[r]),this.notificationTimers[r]=setTimeout(async()=>{try{await this.clearNotification({id:r})}catch{}},d*1e3)),h()})})}clearNotification({id:e}){return new Promise((t,n)=>{e||n(new Error("Notification id is not defined")),clearTimeout(this.notificationTimers[e]),chrome.notifications.clear(e,s=>{s?(this.visibleNotificationId=null,t()):n()})})}setActiveTab(e){chrome.windows.update(e.windowId,{focused:!0}),chrome.tabs.update(e.id,{active:!0})}addNotificationsListener(){const e=t=>{i.commit("NOTIFICATION_LEVEL",{level:t==="granted"})};chrome.notifications.getPermissionLevel(e),chrome.notifications.onPermissionLevelChanged.addListener(e),chrome.notifications.onClicked.addListener(async t=>{const n=this.getMasterTab();this.setActiveTab(n);try{await this.clearNotification({id:t})}catch{}})}getMasterTab(){return i.state.tabs.at(-1)}}new I;