"use strict";function _slicedToArray(e,a){return _arrayWithHoles(e)||_iterableToArrayLimit(e,a)||_unsupportedIterableToArray(e,a)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,a){var r;if(e)return"string"==typeof e?_arrayLikeToArray(e,a):"Map"===(r="Object"===(r={}.toString.call(e).slice(8,-1))&&e.constructor?e.constructor.name:r)||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(e,a):void 0}function _arrayLikeToArray(e,a){(null==a||a>e.length)&&(a=e.length);for(var r=0,t=Array(a);r<a;r++)t[r]=e[r];return t}function _iterableToArrayLimit(e,a){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var t,n,c,i,o=[],s=!0,l=!1;try{if(c=(r=r.call(e)).next,0===a){if(Object(r)!==r)return;s=!1}else for(;!(s=(t=c.call(r)).done)&&(o.push(t.value),o.length!==a);s=!0);}catch(e){l=!0,n=e}finally{try{if(!s&&null!=r.return&&(i=r.return(),Object(i)!==i))return}finally{if(l)throw n}}return o}}function _arrayWithHoles(e){if(Array.isArray(e))return e}cjce.registerTemplate("bm-p-status",function(e,c){var t,n="https://www.google.com",i=n+"/appsstatus/dashboard/",o={product:cjBasics.lang.i18n("cj_i18n_07184","Product"),incident:cjBasics.lang.i18n("cj_i18n_07185","Incident"),overview:cjBasics.lang.i18n("cj_i18n_06492","Overview"),summary:cjBasics.lang.i18n("cj_i18n_07186","Incidents summary")},a=cjBasics.generateUniqueId(),r={bm_cid:"status",bm_cst:"2",bm_iid:a,hl:cjBasics.lang.getCurrent()},s=cjce.createElement("bm-ogb",{loading:!0,withShadow:c.darkMode,serviceIcon:"admin",serviceLabel:cjBasics.lang.i18n("cj_i18n_06692","Workspace Status Dashboard"),pageLabel:o.overview,bmApis:c,onBack:function(){t.cjceSendFrameCommand({method:"bmCstNavigateBack"},n),s.cjceSetPageLabel(o.overview)},onNewTab:function(e,a,r){t.cjceGetCleanUrl(n).then(function(e){c.openTab(e||i)})}}),l=(e.appendChild(s),cjce.createElement("ccbm-iconbutton",{iconName:"__mdi:history",label:o.summary,onClick:function(){l.hidden=!0,s.cjceSetBackState(!0),s.cjceSetPageLabel(o.summary),s.cjceSetLoading(!0),t.src=cjBasics.urlParams.attach(i+"summary",r)}}));s.cjceAppendChild(l),t=cjce.createElement("bm-iframe",{solid:c.darkMode?"#fff":"transparent",src:cjBasics.urlParams.attach(i,r),onLoad:function(){s.cjceSetLoading(!1)},onBmMessage:function(e,a){var r,t,n;"statusViewData"===e?(n="overview",-1!==(t=a.pathname).indexOf("/incidents")?n="incident":-1!==t.indexOf("/summary")?n="summary":-1!==t.indexOf("/products")&&(n="product"),s.cjceSetBackState("overview"!==n),t=o[n],(r=a.label)&&(t+=": "+r),s.cjceSetPageLabel(t),l.hidden="summary"===n):"bmCstOpenUrl"===e&&(t=(r=_slicedToArray(a,3))[0],n=r[1],e=r[2],a=cjBasics.cleanBmUrl(t),c.openTab(a,n,e))}}),cjBasics.webRequest.handleIframeHeaders([n+"/*bm_iid="+a+"*"],{handleFirefoxInject:!0}),e.appendChild(t)});