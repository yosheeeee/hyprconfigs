import{z as be}from"./vendor.js";var _e=Object.defineProperty,me=(t,e,r)=>e in t?_e(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,g=(t,e,r)=>(me(t,typeof e!="symbol"?e+"":e,r),r);const ee="@@SYNC_STATE",vt="@@SYNC",B="@@SYNC_MUTATION",Se="@@SYNC_RECONNECT_MUTATION";class re{constructor({store:e,options:r}){g(this,"store"),g(this,"options"),g(this,"logLevel","info"),this.store=e,this.options={persist:[],ignore:[],debug:!1,strategy:"broadcast",electionFunc:null,...r},this.logLevel=this.options.debug===!0?"debug":this.options.debug===!1?"info":this.options.debug||"info",this.store.subscribe(this.onMutation.bind(this))}onMutation(e,r){throw new TypeError("onMutation must be implemented")}}function ne(t,e="info"){return{levels:["trace","debug","info","warn","error"],colors:["\x1B[34m","\x1B[35m","\x1B[32m","\x1B[33m","\x1B[31m"],level:e,namespace:t,setLevel(r){if(this.levels.includes(r))this.level=r;else throw new Error(`Invalid log level: ${r}`)},_log(r,...n){const o=this.levels.indexOf(r);o>=this.levels.indexOf(this.level)&&console[["debug","trace","info"].includes(r)?"log":r](Array.isArray(this.namespace)?`${this.colors[o]}${r.toUpperCase()}\x1B[0m: [${this.namespace.join("][")}]`:`[${this.namespace}]`,...n)},trace(...r){this._log("trace",...r)},debug(...r){this._log("debug",...r)},info(...r){this._log("info",...r)},log(...r){this._log("info",...r)},warn(...r){this._log("warn",...r)},error(...r){this._log("error",...r)}}}class Ee extends re{constructor(e){super(e),g(this,"logger",ne(["vuex-extension-sync","Page"],this.logLevel)),g(this,"port"),g(this,"connectionName"),g(this,"initialized",!1),g(this,"pendingMutationsQueue",[]),g(this,"externalMutations",[]),this.connectionName=`${e.pageType}_${Math.random().toString(36).substring(2,9)}`,this.connect()}connect(e=!1){this.port=chrome.runtime.connect({name:this.connectionName}),this.port.onMessage.addListener(this.onMessage.bind(this)),this.port.onDisconnect.addListener(()=>{this.connect(!0)}),e&&this.store.commit(Se)}onMessage(e){this.logger.debug(`[${this.connectionName}][onMessage] Received message:`,e);const{type:r,data:n}=e;if(r===ee)this.logger.debug(`[${this.connectionName}][onMessage] Replacing state with`,e.data),this.store.replaceState(e.data),this.initialized=!0,this.processPendingMutationsQueue();else if(r===B){if(!this.initialized){this.logger.warn(`[${this.connectionName}][onMessage] Not initialized yet`);return}this.logger.debug(`[${this.connectionName}][onMessage] Applying mutation`);const{type:o,payload:i}=n;this.externalMutations.push(n),this.store.commit(o,i)}}onMutation(e){if(this.logger.debug(`[${this.connectionName}][onMutation] Mutation fired`,e),this.options.ignore&&this.options.ignore.includes(e.type)){this.logger.warn(`[${this.connectionName}][onMutation] Mutation "${e.type}" is ignored`);return}if(!this.initialized){this.logger.warn(`[${this.connectionName}][onMutation] Not initialized yet`),this.pendingMutationsQueue.push(e);return}const r=this.externalMutations.findIndex(n=>n.type===e.type&&n.payload===e.payload);r===-1?(this.logger.debug(`[${this.connectionName}][onMutation] Sync it to bg`),this.port.postMessage({type:B,data:{type:e.type,payload:e.payload}})):(this.externalMutations.splice(r,1),this.logger.debug(`[${this.connectionName}][onMutation] Skip applied`))}processPendingMutationsQueue(){if(this.logger.debug(`[${this.connectionName}][processPendingMutationsQueue] Processing pending mutation queue`),this.pendingMutationsQueue.length===0){this.logger.debug(`[${this.connectionName}][processPendingMutationsQueue] Empty queue`);return}do{const e=this.pendingMutationsQueue.shift(),{type:r,payload:n}=e;this.logger.debug(`[${this.connectionName}][processPendingMutationsQueue] Processing pending mutation`,r,n),this.store.commit(r,n)}while(this.pendingMutationsQueue.length>0)}}var F=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},je=Array.isArray,m=je,Me=typeof F=="object"&&F&&F.Object===Object&&F,oe=Me,we=oe,Oe=typeof self=="object"&&self&&self.Object===Object&&self,Te=we||Oe||Function("return this")(),b=Te,Ae=b,Ne=Ae.Symbol,x=Ne,yt=x,ie=Object.prototype,Pe=ie.hasOwnProperty,Ce=ie.toString,C=yt?yt.toStringTag:void 0;function ke(t){var e=Pe.call(t,C),r=t[C];try{t[C]=void 0;var n=!0}catch{}var o=Ce.call(t);return n&&(e?t[C]=r:delete t[C]),o}var xe=ke,$e=Object.prototype,Ie=$e.toString;function Le(t){return Ie.call(t)}var ze=Le,bt=x,Fe=xe,Ve=ze,Ue="[object Null]",Be="[object Undefined]",_t=bt?bt.toStringTag:void 0;function Re(t){return t==null?t===void 0?Be:Ue:_t&&_t in Object(t)?Fe(t):Ve(t)}var $=Re;function De(t){return t!=null&&typeof t=="object"}var I=De,Ge=$,Ke=I,Qe="[object Symbol]";function Ye(t){return typeof t=="symbol"||Ke(t)&&Ge(t)==Qe}var it=Ye,We=m,qe=it,He=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,Xe=/^\w*$/;function Je(t,e){if(We(t))return!1;var r=typeof t;return r=="number"||r=="symbol"||r=="boolean"||t==null||qe(t)?!0:Xe.test(t)||!He.test(t)||e!=null&&t in Object(e)}var Ze=Je;function tr(t){var e=typeof t;return t!=null&&(e=="object"||e=="function")}var st=tr,er=$,rr=st,nr="[object AsyncFunction]",or="[object Function]",ir="[object GeneratorFunction]",sr="[object Proxy]";function ar(t){if(!rr(t))return!1;var e=er(t);return e==or||e==ir||e==nr||e==sr}var se=ar,ur=b,cr=ur["__core-js_shared__"],lr=cr,q=lr,mt=function(){var t=/[^.]+$/.exec(q&&q.keys&&q.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();function pr(t){return!!mt&&mt in t}var hr=pr,gr=Function.prototype,fr=gr.toString;function dr(t){if(t!=null){try{return fr.call(t)}catch{}try{return t+""}catch{}}return""}var ae=dr,vr=se,yr=hr,br=st,_r=ae,mr=/[\\^$.*+?()[\]{}|]/g,Sr=/^\[object .+?Constructor\]$/,Er=Function.prototype,jr=Object.prototype,Mr=Er.toString,wr=jr.hasOwnProperty,Or=RegExp("^"+Mr.call(wr).replace(mr,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function Tr(t){if(!br(t)||yr(t))return!1;var e=vr(t)?Or:Sr;return e.test(_r(t))}var Ar=Tr;function Nr(t,e){return t==null?void 0:t[e]}var Pr=Nr,Cr=Ar,kr=Pr;function xr(t,e){var r=kr(t,e);return Cr(r)?r:void 0}var M=xr,$r=M,Ir=$r(Object,"create"),G=Ir,St=G;function Lr(){this.__data__=St?St(null):{},this.size=0}var zr=Lr;function Fr(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e}var Vr=Fr,Ur=G,Br="__lodash_hash_undefined__",Rr=Object.prototype,Dr=Rr.hasOwnProperty;function Gr(t){var e=this.__data__;if(Ur){var r=e[t];return r===Br?void 0:r}return Dr.call(e,t)?e[t]:void 0}var Kr=Gr,Qr=G,Yr=Object.prototype,Wr=Yr.hasOwnProperty;function qr(t){var e=this.__data__;return Qr?e[t]!==void 0:Wr.call(e,t)}var Hr=qr,Xr=G,Jr="__lodash_hash_undefined__";function Zr(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=Xr&&e===void 0?Jr:e,this}var tn=Zr,en=zr,rn=Vr,nn=Kr,on=Hr,sn=tn;function O(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}O.prototype.clear=en;O.prototype.delete=rn;O.prototype.get=nn;O.prototype.has=on;O.prototype.set=sn;var an=O;function un(){this.__data__=[],this.size=0}var cn=un;function ln(t,e){return t===e||t!==t&&e!==e}var at=ln,pn=at;function hn(t,e){for(var r=t.length;r--;)if(pn(t[r][0],e))return r;return-1}var K=hn,gn=K,fn=Array.prototype,dn=fn.splice;function vn(t){var e=this.__data__,r=gn(e,t);if(r<0)return!1;var n=e.length-1;return r==n?e.pop():dn.call(e,r,1),--this.size,!0}var yn=vn,bn=K;function _n(t){var e=this.__data__,r=bn(e,t);return r<0?void 0:e[r][1]}var mn=_n,Sn=K;function En(t){return Sn(this.__data__,t)>-1}var jn=En,Mn=K;function wn(t,e){var r=this.__data__,n=Mn(r,t);return n<0?(++this.size,r.push([t,e])):r[n][1]=e,this}var On=wn,Tn=cn,An=yn,Nn=mn,Pn=jn,Cn=On;function T(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}T.prototype.clear=Tn;T.prototype.delete=An;T.prototype.get=Nn;T.prototype.has=Pn;T.prototype.set=Cn;var Q=T,kn=M,xn=b,$n=kn(xn,"Map"),ut=$n,Et=an,In=Q,Ln=ut;function zn(){this.size=0,this.__data__={hash:new Et,map:new(Ln||In),string:new Et}}var Fn=zn;function Vn(t){var e=typeof t;return e=="string"||e=="number"||e=="symbol"||e=="boolean"?t!=="__proto__":t===null}var Un=Vn,Bn=Un;function Rn(t,e){var r=t.__data__;return Bn(e)?r[typeof e=="string"?"string":"hash"]:r.map}var Y=Rn,Dn=Y;function Gn(t){var e=Dn(this,t).delete(t);return this.size-=e?1:0,e}var Kn=Gn,Qn=Y;function Yn(t){return Qn(this,t).get(t)}var Wn=Yn,qn=Y;function Hn(t){return qn(this,t).has(t)}var Xn=Hn,Jn=Y;function Zn(t,e){var r=Jn(this,t),n=r.size;return r.set(t,e),this.size+=r.size==n?0:1,this}var to=Zn,eo=Fn,ro=Kn,no=Wn,oo=Xn,io=to;function A(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}A.prototype.clear=eo;A.prototype.delete=ro;A.prototype.get=no;A.prototype.has=oo;A.prototype.set=io;var ct=A,ue=ct,so="Expected a function";function lt(t,e){if(typeof t!="function"||e!=null&&typeof e!="function")throw new TypeError(so);var r=function(){var n=arguments,o=e?e.apply(this,n):n[0],i=r.cache;if(i.has(o))return i.get(o);var s=t.apply(this,n);return r.cache=i.set(o,s)||i,s};return r.cache=new(lt.Cache||ue),r}lt.Cache=ue;var ao=lt,uo=ao,co=500;function lo(t){var e=uo(t,function(n){return r.size===co&&r.clear(),n}),r=e.cache;return e}var po=lo,ho=po,go=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,fo=/\\(\\)?/g,vo=ho(function(t){var e=[];return t.charCodeAt(0)===46&&e.push(""),t.replace(go,function(r,n,o,i){e.push(o?i.replace(fo,"$1"):n||r)}),e}),yo=vo;function bo(t,e){for(var r=-1,n=t==null?0:t.length,o=Array(n);++r<n;)o[r]=e(t[r],r,t);return o}var _o=bo,jt=x,mo=_o,So=m,Eo=it,jo=1/0,Mt=jt?jt.prototype:void 0,wt=Mt?Mt.toString:void 0;function ce(t){if(typeof t=="string")return t;if(So(t))return mo(t,ce)+"";if(Eo(t))return wt?wt.call(t):"";var e=t+"";return e=="0"&&1/t==-jo?"-0":e}var Mo=ce,wo=Mo;function Oo(t){return t==null?"":wo(t)}var To=Oo,Ao=m,No=Ze,Po=yo,Co=To;function ko(t,e){return Ao(t)?t:No(t,e)?[t]:Po(Co(t))}var W=ko,xo=it,$o=1/0;function Io(t){if(typeof t=="string"||xo(t))return t;var e=t+"";return e=="0"&&1/t==-$o?"-0":e}var pt=Io,Lo=W,zo=pt;function Fo(t,e){e=Lo(e,t);for(var r=0,n=e.length;t!=null&&r<n;)t=t[zo(e[r++])];return r&&r==n?t:void 0}var Vo=Fo,Uo=M,Bo=function(){try{var t=Uo(Object,"defineProperty");return t({},"",{}),t}catch{}}(),le=Bo,Ot=le;function Ro(t,e,r){e=="__proto__"&&Ot?Ot(t,e,{configurable:!0,enumerable:!0,value:r,writable:!0}):t[e]=r}var Do=Ro,Go=Do,Ko=at,Qo=Object.prototype,Yo=Qo.hasOwnProperty;function Wo(t,e,r){var n=t[e];(!(Yo.call(t,e)&&Ko(n,r))||r===void 0&&!(e in t))&&Go(t,e,r)}var qo=Wo,Ho=9007199254740991,Xo=/^(?:0|[1-9]\d*)$/;function Jo(t,e){var r=typeof t;return e=e??Ho,!!e&&(r=="number"||r!="symbol"&&Xo.test(t))&&t>-1&&t%1==0&&t<e}var ht=Jo,Zo=qo,ti=W,ei=ht,Tt=st,ri=pt;function ni(t,e,r,n){if(!Tt(t))return t;e=ti(e,t);for(var o=-1,i=e.length,s=i-1,a=t;a!=null&&++o<i;){var c=ri(e[o]),u=r;if(c==="__proto__"||c==="constructor"||c==="prototype")return t;if(o!=s){var p=a[c];u=n?n(p,c,a):void 0,u===void 0&&(u=Tt(p)?p:ei(e[o+1])?[]:{})}Zo(a,c,u),a=a[c]}return t}var oi=ni,ii=Vo,si=oi,ai=W;function ui(t,e,r){for(var n=-1,o=e.length,i={};++n<o;){var s=e[n],a=ii(t,s);r(a,s)&&si(i,ai(s,t),a)}return i}var ci=ui;function li(t,e){return t!=null&&e in Object(t)}var pi=li,hi=$,gi=I,fi="[object Arguments]";function di(t){return gi(t)&&hi(t)==fi}var vi=di,At=vi,yi=I,pe=Object.prototype,bi=pe.hasOwnProperty,_i=pe.propertyIsEnumerable,mi=At(function(){return arguments}())?At:function(t){return yi(t)&&bi.call(t,"callee")&&!_i.call(t,"callee")},gt=mi,Si=9007199254740991;function Ei(t){return typeof t=="number"&&t>-1&&t%1==0&&t<=Si}var ft=Ei,ji=W,Mi=gt,wi=m,Oi=ht,Ti=ft,Ai=pt;function Ni(t,e,r){e=ji(e,t);for(var n=-1,o=e.length,i=!1;++n<o;){var s=Ai(e[n]);if(!(i=t!=null&&r(t,s)))break;t=t[s]}return i||++n!=o?i:(o=t==null?0:t.length,!!o&&Ti(o)&&Oi(s,o)&&(wi(t)||Mi(t)))}var Pi=Ni,Ci=pi,ki=Pi;function xi(t,e){return t!=null&&ki(t,e,Ci)}var $i=xi,Ii=ci,Li=$i;function zi(t,e){return Ii(t,e,function(r,n){return Li(t,n)})}var Fi=zi;function Vi(t,e){for(var r=-1,n=e.length,o=t.length;++r<n;)t[o+r]=e[r];return t}var he=Vi,Nt=x,Ui=gt,Bi=m,Pt=Nt?Nt.isConcatSpreadable:void 0;function Ri(t){return Bi(t)||Ui(t)||!!(Pt&&t&&t[Pt])}var Di=Ri,Gi=he,Ki=Di;function ge(t,e,r,n,o){var i=-1,s=t.length;for(r||(r=Ki),o||(o=[]);++i<s;){var a=t[i];e>0&&r(a)?e>1?ge(a,e-1,r,n,o):Gi(o,a):n||(o[o.length]=a)}return o}var Qi=ge,Yi=Qi;function Wi(t){var e=t==null?0:t.length;return e?Yi(t,1):[]}var qi=Wi;function Hi(t,e,r){switch(r.length){case 0:return t.call(e);case 1:return t.call(e,r[0]);case 2:return t.call(e,r[0],r[1]);case 3:return t.call(e,r[0],r[1],r[2])}return t.apply(e,r)}var Xi=Hi,Ji=Xi,Ct=Math.max;function Zi(t,e,r){return e=Ct(e===void 0?t.length-1:e,0),function(){for(var n=arguments,o=-1,i=Ct(n.length-e,0),s=Array(i);++o<i;)s[o]=n[e+o];o=-1;for(var a=Array(e+1);++o<e;)a[o]=n[o];return a[e]=r(s),Ji(t,this,a)}}var ts=Zi;function es(t){return function(){return t}}var rs=es;function ns(t){return t}var os=ns,is=rs,kt=le,ss=os,as=kt?function(t,e){return kt(t,"toString",{configurable:!0,enumerable:!1,value:is(e),writable:!0})}:ss,us=as,cs=800,ls=16,ps=Date.now;function hs(t){var e=0,r=0;return function(){var n=ps(),o=ls-(n-r);if(r=n,o>0){if(++e>=cs)return arguments[0]}else e=0;return t.apply(void 0,arguments)}}var gs=hs,fs=us,ds=gs,vs=ds(fs),ys=vs,bs=qi,_s=ts,ms=ys;function Ss(t){return ms(_s(t,void 0,bs),t+"")}var Es=Ss,js=Fi,Ms=Es,ws=Ms(function(t,e){return t==null?{}:js(t,e)}),w=ws,Os=Q;function Ts(){this.__data__=new Os,this.size=0}var As=Ts;function Ns(t){var e=this.__data__,r=e.delete(t);return this.size=e.size,r}var Ps=Ns;function Cs(t){return this.__data__.get(t)}var ks=Cs;function xs(t){return this.__data__.has(t)}var $s=xs,Is=Q,Ls=ut,zs=ct,Fs=200;function Vs(t,e){var r=this.__data__;if(r instanceof Is){var n=r.__data__;if(!Ls||n.length<Fs-1)return n.push([t,e]),this.size=++r.size,this;r=this.__data__=new zs(n)}return r.set(t,e),this.size=r.size,this}var Us=Vs,Bs=Q,Rs=As,Ds=Ps,Gs=ks,Ks=$s,Qs=Us;function N(t){var e=this.__data__=new Bs(t);this.size=e.size}N.prototype.clear=Rs;N.prototype.delete=Ds;N.prototype.get=Gs;N.prototype.has=Ks;N.prototype.set=Qs;var Ys=N,Ws="__lodash_hash_undefined__";function qs(t){return this.__data__.set(t,Ws),this}var Hs=qs;function Xs(t){return this.__data__.has(t)}var Js=Xs,Zs=ct,ta=Hs,ea=Js;function R(t){var e=-1,r=t==null?0:t.length;for(this.__data__=new Zs;++e<r;)this.add(t[e])}R.prototype.add=R.prototype.push=ta;R.prototype.has=ea;var ra=R;function na(t,e){for(var r=-1,n=t==null?0:t.length;++r<n;)if(e(t[r],r,t))return!0;return!1}var oa=na;function ia(t,e){return t.has(e)}var sa=ia,aa=ra,ua=oa,ca=sa,la=1,pa=2;function ha(t,e,r,n,o,i){var s=r&la,a=t.length,c=e.length;if(a!=c&&!(s&&c>a))return!1;var u=i.get(t),p=i.get(e);if(u&&p)return u==e&&p==t;var f=-1,h=!0,y=r&pa?new aa:void 0;for(i.set(t,e),i.set(e,t);++f<a;){var d=t[f],v=e[f];if(n)var _=s?n(v,d,f,e,t,i):n(d,v,f,t,e,i);if(_!==void 0){if(_)continue;h=!1;break}if(y){if(!ua(e,function(S,E){if(!ca(y,E)&&(d===S||o(d,S,r,n,i)))return y.push(E)})){h=!1;break}}else if(!(d===v||o(d,v,r,n,i))){h=!1;break}}return i.delete(t),i.delete(e),h}var fe=ha,ga=b,fa=ga.Uint8Array,da=fa;function va(t){var e=-1,r=Array(t.size);return t.forEach(function(n,o){r[++e]=[o,n]}),r}var ya=va;function ba(t){var e=-1,r=Array(t.size);return t.forEach(function(n){r[++e]=n}),r}var _a=ba,xt=x,$t=da,ma=at,Sa=fe,Ea=ya,ja=_a,Ma=1,wa=2,Oa="[object Boolean]",Ta="[object Date]",Aa="[object Error]",Na="[object Map]",Pa="[object Number]",Ca="[object RegExp]",ka="[object Set]",xa="[object String]",$a="[object Symbol]",Ia="[object ArrayBuffer]",La="[object DataView]",It=xt?xt.prototype:void 0,H=It?It.valueOf:void 0;function za(t,e,r,n,o,i,s){switch(r){case La:if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset)return!1;t=t.buffer,e=e.buffer;case Ia:return!(t.byteLength!=e.byteLength||!i(new $t(t),new $t(e)));case Oa:case Ta:case Pa:return ma(+t,+e);case Aa:return t.name==e.name&&t.message==e.message;case Ca:case xa:return t==e+"";case Na:var a=Ea;case ka:var c=n&Ma;if(a||(a=ja),t.size!=e.size&&!c)return!1;var u=s.get(t);if(u)return u==e;n|=wa,s.set(t,e);var p=Sa(a(t),a(e),n,o,i,s);return s.delete(t),p;case $a:if(H)return H.call(t)==H.call(e)}return!1}var Fa=za,Va=he,Ua=m;function Ba(t,e,r){var n=e(t);return Ua(t)?n:Va(n,r(t))}var Ra=Ba;function Da(t,e){for(var r=-1,n=t==null?0:t.length,o=0,i=[];++r<n;){var s=t[r];e(s,r,t)&&(i[o++]=s)}return i}var Ga=Da;function Ka(){return[]}var Qa=Ka,Ya=Ga,Wa=Qa,qa=Object.prototype,Ha=qa.propertyIsEnumerable,Lt=Object.getOwnPropertySymbols,Xa=Lt?function(t){return t==null?[]:(t=Object(t),Ya(Lt(t),function(e){return Ha.call(t,e)}))}:Wa,Ja=Xa;function Za(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}var tu=Za,k={},eu={get exports(){return k},set exports(t){k=t}};function ru(){return!1}var nu=ru;(function(t,e){var r=b,n=nu,o=e&&!e.nodeType&&e,i=o&&!0&&t&&!t.nodeType&&t,s=i&&i.exports===o,a=s?r.Buffer:void 0,c=a?a.isBuffer:void 0,u=c||n;t.exports=u})(eu,k);var ou=$,iu=ft,su=I,au="[object Arguments]",uu="[object Array]",cu="[object Boolean]",lu="[object Date]",pu="[object Error]",hu="[object Function]",gu="[object Map]",fu="[object Number]",du="[object Object]",vu="[object RegExp]",yu="[object Set]",bu="[object String]",_u="[object WeakMap]",mu="[object ArrayBuffer]",Su="[object DataView]",Eu="[object Float32Array]",ju="[object Float64Array]",Mu="[object Int8Array]",wu="[object Int16Array]",Ou="[object Int32Array]",Tu="[object Uint8Array]",Au="[object Uint8ClampedArray]",Nu="[object Uint16Array]",Pu="[object Uint32Array]",l={};l[Eu]=l[ju]=l[Mu]=l[wu]=l[Ou]=l[Tu]=l[Au]=l[Nu]=l[Pu]=!0;l[au]=l[uu]=l[mu]=l[cu]=l[Su]=l[lu]=l[pu]=l[hu]=l[gu]=l[fu]=l[du]=l[vu]=l[yu]=l[bu]=l[_u]=!1;function Cu(t){return su(t)&&iu(t.length)&&!!l[ou(t)]}var ku=Cu;function xu(t){return function(e){return t(e)}}var $u=xu,D={},Iu={get exports(){return D},set exports(t){D=t}};(function(t,e){var r=oe,n=e&&!e.nodeType&&e,o=n&&!0&&t&&!t.nodeType&&t,i=o&&o.exports===n,s=i&&r.process,a=function(){try{var c=o&&o.require&&o.require("util").types;return c||s&&s.binding&&s.binding("util")}catch{}}();t.exports=a})(Iu,D);var Lu=ku,zu=$u,zt=D,Ft=zt&&zt.isTypedArray,Fu=Ft?zu(Ft):Lu,de=Fu,Vu=tu,Uu=gt,Bu=m,Ru=k,Du=ht,Gu=de,Ku=Object.prototype,Qu=Ku.hasOwnProperty;function Yu(t,e){var r=Bu(t),n=!r&&Uu(t),o=!r&&!n&&Ru(t),i=!r&&!n&&!o&&Gu(t),s=r||n||o||i,a=s?Vu(t.length,String):[],c=a.length;for(var u in t)(e||Qu.call(t,u))&&!(s&&(u=="length"||o&&(u=="offset"||u=="parent")||i&&(u=="buffer"||u=="byteLength"||u=="byteOffset")||Du(u,c)))&&a.push(u);return a}var Wu=Yu,qu=Object.prototype;function Hu(t){var e=t&&t.constructor,r=typeof e=="function"&&e.prototype||qu;return t===r}var Xu=Hu;function Ju(t,e){return function(r){return t(e(r))}}var Zu=Ju,tc=Zu,ec=tc(Object.keys,Object),rc=ec,nc=Xu,oc=rc,ic=Object.prototype,sc=ic.hasOwnProperty;function ac(t){if(!nc(t))return oc(t);var e=[];for(var r in Object(t))sc.call(t,r)&&r!="constructor"&&e.push(r);return e}var uc=ac,cc=se,lc=ft;function pc(t){return t!=null&&lc(t.length)&&!cc(t)}var hc=pc,gc=Wu,fc=uc,dc=hc;function vc(t){return dc(t)?gc(t):fc(t)}var yc=vc,bc=Ra,_c=Ja,mc=yc;function Sc(t){return bc(t,mc,_c)}var Ec=Sc,Vt=Ec,jc=1,Mc=Object.prototype,wc=Mc.hasOwnProperty;function Oc(t,e,r,n,o,i){var s=r&jc,a=Vt(t),c=a.length,u=Vt(e),p=u.length;if(c!=p&&!s)return!1;for(var f=c;f--;){var h=a[f];if(!(s?h in e:wc.call(e,h)))return!1}var y=i.get(t),d=i.get(e);if(y&&d)return y==e&&d==t;var v=!0;i.set(t,e),i.set(e,t);for(var _=s;++f<c;){h=a[f];var S=t[h],E=e[h];if(n)var dt=s?n(E,S,h,e,t,i):n(S,E,h,t,e,i);if(!(dt===void 0?S===E||o(S,E,r,n,i):dt)){v=!1;break}_||(_=h=="constructor")}if(v&&!_){var L=t.constructor,z=e.constructor;L!=z&&"constructor"in t&&"constructor"in e&&!(typeof L=="function"&&L instanceof L&&typeof z=="function"&&z instanceof z)&&(v=!1)}return i.delete(t),i.delete(e),v}var Tc=Oc,Ac=M,Nc=b,Pc=Ac(Nc,"DataView"),Cc=Pc,kc=M,xc=b,$c=kc(xc,"Promise"),Ic=$c,Lc=M,zc=b,Fc=Lc(zc,"Set"),Vc=Fc,Uc=M,Bc=b,Rc=Uc(Bc,"WeakMap"),Dc=Rc,tt=Cc,et=ut,rt=Ic,nt=Vc,ot=Dc,ve=$,P=ae,Ut="[object Map]",Gc="[object Object]",Bt="[object Promise]",Rt="[object Set]",Dt="[object WeakMap]",Gt="[object DataView]",Kc=P(tt),Qc=P(et),Yc=P(rt),Wc=P(nt),qc=P(ot),j=ve;(tt&&j(new tt(new ArrayBuffer(1)))!=Gt||et&&j(new et)!=Ut||rt&&j(rt.resolve())!=Bt||nt&&j(new nt)!=Rt||ot&&j(new ot)!=Dt)&&(j=function(t){var e=ve(t),r=e==Gc?t.constructor:void 0,n=r?P(r):"";if(n)switch(n){case Kc:return Gt;case Qc:return Ut;case Yc:return Bt;case Wc:return Rt;case qc:return Dt}return e});var Hc=j,X=Ys,Xc=fe,Jc=Fa,Zc=Tc,Kt=Hc,Qt=m,Yt=k,tl=de,el=1,Wt="[object Arguments]",qt="[object Array]",V="[object Object]",rl=Object.prototype,Ht=rl.hasOwnProperty;function nl(t,e,r,n,o,i){var s=Qt(t),a=Qt(e),c=s?qt:Kt(t),u=a?qt:Kt(e);c=c==Wt?V:c,u=u==Wt?V:u;var p=c==V,f=u==V,h=c==u;if(h&&Yt(t)){if(!Yt(e))return!1;s=!0,p=!1}if(h&&!p)return i||(i=new X),s||tl(t)?Xc(t,e,r,n,o,i):Jc(t,e,c,r,n,o,i);if(!(r&el)){var y=p&&Ht.call(t,"__wrapped__"),d=f&&Ht.call(e,"__wrapped__");if(y||d){var v=y?t.value():t,_=d?e.value():e;return i||(i=new X),o(v,_,r,n,i)}}return h?(i||(i=new X),Zc(t,e,r,n,o,i)):!1}var ol=nl,il=ol,Xt=I;function ye(t,e,r,n,o){return t===e?!0:t==null||e==null||!Xt(t)&&!Xt(e)?t!==t&&e!==e:il(t,e,r,n,ye,o)}var sl=ye,al=sl;function ul(t,e){return al(t,e)}var Jt=ul;function cl(t){return new Promise((e,r)=>{chrome.storage.local.get(t,n=>{chrome.runtime.lastError?r(chrome.runtime.lastError):e(n[t])})})}function ll(t){return new Promise((e,r)=>{chrome.storage.local.set(t,()=>{chrome.runtime.lastError?r(chrome.runtime.lastError):e()})})}class pl extends re{constructor(e){super(e),g(this,"logger",ne(["vuex-extension-sync","Background"],this.logLevel)),g(this,"ports",new Map),g(this,"prevPersistedState"),g(this,"syncFromMutations",[]),chrome.runtime.onConnect.addListener(this.onConnect.bind(this)),this.prevPersistedState=w(this.store.state,this.options.persist),this.initPersistentStore().finally(),this.store.getters.picked=r=>w(r,this.options.persist)}onConnect(e){if(this.logger.debug(`[onConnect][${e.name}] Connected`),this.ports.set(e,this.options.strategy==="master"?{usedInMasterStrategy:e.name.startsWith("cs_"),master:!1,created:Date.now()}:{}),this.masterElection(),e.onMessage.addListener(r=>this.onMessage(r,e)),e.onDisconnect.addListener(()=>this.onDisconnect(e)),this.options.strategy==="master"&&!this.isMaster(e)&&this.usedInMasterStrategy(e)){this.logger.debug(`[onMessage][${e.name}] Skip syncState due master strategy and not master port`);return}this.syncState(e)}masterElection(){if(this.options.strategy!=="master"||!this.ports.size)return;const[[e]=[]]=[...this.ports.entries()].filter(([,n])=>n.master===!0);let r;if(this.options.electionFunc)this.logger.debug("[masterElection] Using custom election function"),r=this.options.electionFunc(this.ports);else{this.logger.debug("[masterElection] Using default election function (first is master)");const[[n]=[]]=[...this.ports.entries()].filter(([,o])=>o.usedInMasterStrategy).sort(([,o],[,i])=>o.created-i.created);r=n}if(!r){this.logger.debug("[masterElection] Master not found",this.ports);return}e&&this.ports.set(e,{...this.ports.get(e),master:!1}),this.ports.set(r,{...this.ports.get(r),master:!0}),e!==r&&(this.logger.debug("[masterElection] New master sync state"),this.syncState(r)),this.logger.debug(`[masterElection] Master chosen -> "${r.name}" from ports`,this.ports)}usedInMasterStrategy(e){return this.ports.get(e).usedInMasterStrategy}isMaster(e){return this.ports.get(e).master}async onMutation(e,r){var n;const{type:o,payload:i}=e,s=this.syncFromMutations.findIndex(c=>c.type===o&&c.payload===i),a=s===-1?"self":this.syncFromMutations[s].from;if(this.logger.debug(`[onMutation] Received mutation from "${a}"`,e),this.options.ignore&&this.options.ignore.includes(o)){this.logger.warn(`[onMutation] Mutation "${o}" is ignored`);return}if(this.ports.forEach((c,u)=>{if(this.options.strategy==="master"&&!this.isMaster(u)&&this.usedInMasterStrategy(u)){this.logger.debug(`[onMessage][${u.name}] Skip mutation broadcast to this port due master strategy and not master port`);return}if(u.name!==a){const p={type:B,data:{type:o,payload:i}};u.postMessage(p),this.logger.debug(`[onMutation] Broadcast from "${a}" to "${u.name}":`,p)}}),this.syncFromMutations.splice(s,1),(n=this.options.persist)!=null&&n.length){const c=w(r,this.options.persist);Jt(this.prevPersistedState,c)||(this.logger.debug("[onMutation] Persisting state",this.options.persist),await this.persistState(c))}this.prevPersistedState=w(r,this.options.persist)}onMessage(e,r){if(this.logger.debug(`[onMessage][${r.name}] Received message`,e),this.options.strategy==="master"&&!this.isMaster(r)&&this.usedInMasterStrategy(r)){this.logger.debug(`[onMessage][${r.name}] Skip message handler for this port due master strategy and not master port`);return}if(e.type===B){this.logger.debug(`[onMessage][${r.name}] Applying mutation`);const{type:n,payload:o}=e.data;this.syncFromMutations.push({type:n,payload:o,from:r.name}),this.store.commit(n,o)}}onDisconnect(e){this.logger.debug(`[onDisconnect][${e.name}] Disconnected`),this.ports.delete(e),this.masterElection()}syncState(e){this.logger.debug(`[syncState][${e.name}] Sync state with port`),e.postMessage({type:ee,data:this.store.state})}async persistState(e){try{this.logger.debug("[persistState] Writing to localstorage"),await ll({[vt]:e}),this.logger.debug("[persistState] Successfully")}catch(r){this.logger.error("[persistState] Error:",r)}}async initPersistentStore(){var e;if(this.logger.debug("[initPersistentStore] Init persisted state"),!((e=this.options.persist)!=null&&e.length)){this.logger.debug("[initPersistentStore] No keys defined");return}this.logger.debug("[initPersistentStore] Reading from localstorage");try{const r=await cl(vt);if(r===null){this.logger.debug("[initPersistentStore] Localstorage is empty");return}this.store.replaceState({...this.store.state,...w(r,this.options.persist)});const n=w(this.store.state,this.options.persist);Jt(r,n)||(this.logger.debug("[initPersistentStore] Persisting state",this.options.persist),await this.persistState(n)),this.logger.debug("[initPersistentStore] Localstorage found, sync it with all ports"),this.ports.forEach((o,i)=>this.syncState(i)),this.logger.debug("[initPersistentStore] Successfully")}catch(r){this.logger.error("[initPersistentStore] Error:",r)}}}const Zt=globalThis.constructor.name==="ServiceWorkerGlobalScope"?"bg":chrome.action?globalThis.location.href.includes("popup")?"popup":globalThis.location.href.includes("options")?"options":"page":"cs";function hl(t){if(t.persist&&!(Array.isArray(t.persist)&&t.persist.every(e=>typeof e=="string")))throw TypeError("options.persist must be Array of strings");if(t.ignore&&!(Array.isArray(t.ignore)&&t.ignore.every(e=>typeof e=="string")))throw TypeError("options.ignore must be Array of strings");if(t.strategy&&!["broadcast","master"].includes(t.strategy))throw TypeError("options.strategy must be one of ['broadcast', 'master']");if(t.electionFunc&&typeof t.electionFunc!="function")throw TypeError("options.electionFunc must be function(ports)");return function(e){return Zt==="bg"?new pl({options:t,store:e}):new Ee({options:t,store:e,pageType:Zt})}}const J=()=>({loaded:0,position:0,duration:0}),Z=()=>({states:{dislike:null,index:null,like:null,next:null,play:null,prev:null,repeat:null,shuffle:null},repeat:!1,shuffle:!1}),U=()=>({title:"",link:"",version:"",artists:[],cover:"",disliked:!1,liked:!1}),te=()=>({theme:"light",newTabPinned:!0,newTabUrl:"music.yandex.ru",notificationAutoCloseTimeout:3,notifications:!0,scrobbling:!1,scrobblingFilename:"ymusic.txt",scrobblingFormat:"Сейчас играет: %artists% - %track%",scrobblingClearOnPause:!1,scrobblingSaveCoverSeparate:!1,scrobblingCoverFilename:"cover.jpg",browserActionMode:"popup",hotkeysAlreadyLikedAction:"nothing"}),fl=be({state:{isActive:!1,isFocused:!1,isEmptyPlaylist:!0,isPlaying:!1,volume:1,progress:J(),controls:Z(),track:U(),settings:te(),permissions:{notification:!1},tabs:[]},getters:{},mutations:{EVENT_STATE(t,{isPlaying:e}){t.isPlaying=e},EVENT_TRACK(t,{track:e}){e?(t.track.title=e.title,t.track.link=e.link,t.track.version=e.version,t.track.artists=e.artists.map(({link:r,title:n})=>({link:r,title:n.trim()})),t.track.cover="https://"+e.cover,t.track.disliked=e.disliked,t.track.liked=e.liked):t.track=U()},EVENT_CONTROLS(t,{states:e,shuffle:r,repeat:n}){t.controls.repeat=n,t.controls.shuffle=r,t.controls.states=e,t.controls.states.play=!0},EVENT_VOLUME(t,{volume:e}){t.volume=e},EVENT_PROGRESS(t,{progress:e}){t.progress=e},EVENT_THEME(t,{theme:e}){t.settings||(t.settings={}),t.settings.theme=e},EVENT_SHUTDOWN(t){t.isActive=!1,t.progress=J(),t.controls=Z(),t.track=U()},EVENT_STARTED(t){t.isActive=!0},EVENT_FOCUS(t){t.isFocused=!0},EVENT_BLUR(t){t.isFocused=!1},EVENT_TRACKS(t,{count:e}){t.isEmptyPlaylist=e===0,t.isEmptyPlaylist&&(t.progress=J(),t.controls=Z(),t.track=U())},CS_PLAY(){},CS_POSITION(t){},CS_SHUFFLE(){},CS_REPEAT(){},CS_URL(t){},CS_NEXT(){},CS_PREV(){},CS_LIKE(){},CS_DISLIKE(){},CS_VOLUME_UP(){},CS_VOLUME_DOWN(){},CS_VOLUME_TOGGLE(){},CS_VOLUME(){},CS_SEEK_FWD(){},CS_SEEK_BACK(){},BG_OPEN_TAB(){},NOTIFICATION_LEVEL(t,{level:e}){t.permissions.notification=e},ADD_TAB(t,e){t.tabs.find(r=>r.id===e.id)||(t.tabs=[...t.tabs,e])},REMOVE_TAB(t,e){t.tabs=t.tabs.filter(r=>r.id!==e.id)},SYNC_SETTINGS(t){const e=te(),r=t.settings,n={};for(const o of Object.keys(e))o in r||(n[o]=e[o]);Object.keys(n).length&&(t.settings={...r,...n})},SETTINGS_SET_KEY(t,{key:e,value:r}){t.settings={...t.settings,[e]:r}},"@@SYNC_RECONNECT_MUTATION"(){}},actions:{},plugins:[hl({persist:["settings"],debug:!1,ignored:["ADD_TAB","NOTIFICATION_LEVEL","REMOVE_TAB","SETTINGS_SET_KEY","SYNC_SETTINGS"],strategy:"master"})]});export{fl as s};