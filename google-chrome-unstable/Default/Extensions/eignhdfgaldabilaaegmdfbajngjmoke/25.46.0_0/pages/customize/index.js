"use strict";!function(){var u=document;cjce.registerTemplate("bm-p-customize",function(i,n){var t,r,a=!1,o=[],s="_",d=0;function l(e){for(var t=e?e.toLowerCase():"",a=i.querySelectorAll(".bm-p-customize-pageitem"),c=0;c<a.length;c++){var n=t&&-1===a[c].cjceQueryKeywords.indexOf(e);a[c].classList.toggle("bm-p-customize-pageitem--hidden",n)}}function c(){i.textContent="";var e=cjce.createElement("bm-ogb",{serviceIcon:"black_menu_for_google",pageLabel:a?cjBasics.lang.i18n("cj_i18n_02163","Welcome!"):cjBasics.lang.i18n("cj_i18n_01585","Customize menu")}),e=(i.appendChild(e),cjce.createElement("cjmd-secondarytext",{label:a?cjBasics.lang.i18n("cj_i18n_02164",'To get started, click or drag the services you want to be added to the menu. Once done, click "Finish" at the bottom right'):cjBasics.lang.i18n("cj_i18n_02165","Click or drag services to customize the menu")})),e=(e.classList.add("bm-p-customize-infotext"),i.appendChild(e),cjce.createElement("cjmd-appbar",{secondary:!0})),e=(t=cjce.createElement("cjmd-searchbox",{label:cjBasics.lang.i18n("cj_i18n_00085","Search"),onInput:l,onClear:l,color:!0}),e.appendChild(t),i.appendChild(e),cjce.createElement("cjmd-container",{scrollable:!0,shadow:"transparentOnScroll"}));(r=cjce.createElement("cjmd-list")).addEventListener("dragstart",function(e){e.dataTransfer.setData("serviceId",e.target.dataset.id)}),r.addEventListener("click",function(e){var e=u.activeElement||e.target,t=e&&e.dataset.id;t&&(n.userServices.add(t),e.remove(),s=s.replace(t+"_",""))}),e.appendChild(r),i.appendChild(e)}function m(e){var c=u.createDocumentFragment(),a=n.userServices.getDefaultServices(),e=(e.sort(function(e,t){e=a.indexOf(e),t=a.indexOf(t);return e===t?0:t<e?-1:1}).forEach(function(e){e=e,t=n.servicesDatabase[e]||{},a=t.iconName||"placeholder",n.darkMode&&"googleg"===a&&(a="search"),(a=cjce.createElement("cjmd-item",{icon:{serviceName:a},label:t.label||"Page"})).cjceQueryKeywords=(t.label+"-"+cjgFrontend.urls.getShortcutUrl(t.shortcutId)).toLowerCase(),a.classList.add("bm-p-customize-pageitem"),a.draggable=!0,a.dataset.id=e,a.tabIndex=0,(t=cjce.createElement("cjmd-icon",{name:"__mdi:drag_indicator",size:20})).classList.add("bm-p-customize-pageitem__dragicon"),a.appendChild(t);var t,a,e=a;c.appendChild(e)}),r.textContent="",r.appendChild(c),t.value);e&&l(e)}c(),n.setOnPageDisplayHandler(function(e){e=Boolean(e.welcome);e!==a&&(a=e,c(),0<o.length)&&m(o),t.select()}),n.userServices.onChange(function(e,a){var c=d+1;setTimeout(function(){var e,t;e=a,(t=c)===d&&(t=e.join("_")+"_",s!==t)&&(s=t,m(o=e))},d?200:10),d=c})})}();