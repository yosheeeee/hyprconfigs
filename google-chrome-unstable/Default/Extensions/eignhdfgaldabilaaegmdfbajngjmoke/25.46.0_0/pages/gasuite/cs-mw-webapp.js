"use strict";!function(){var e,n,t=window,i=document,A=i,o="cookie",r="360-SUITE-XSRF-TOKEN=",c="APISID=";!function(){var e;if(t.top!==t.self)return"object"!=typeof(e=location.ancestorOrigins)||1===e.length&&-1!==e[0].indexOf("extension://")}()||(n=A[o],-1===(e=n).indexOf(r)&&(e+="; "+r+"AEQ3iEE2AAAAAAAAAAAAAAAAAARcPq6MgA:"+Date.now()),-1===n.indexOf(" "+c)&&(e+="; "+c+((n.split("-"+c)[1]||"").split(";")[0]||1)),-1===n.indexOf("S"+c)&&(e+="; S"+c+((n.split("-3P"+c)[1]||"").split(";")[0]||1)),n===e)||Object.defineProperty(A,o,{get:function(){return e}}),(n=i.currentScript)&&n.remove()}();