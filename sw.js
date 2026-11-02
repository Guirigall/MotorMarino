/* Versioned app shell plus the exact Three.js/font resources loaded by this app. */
const VERSION = '75bb9849554c56ad';
const PREFIX = 'sala3d-pwa:' + self.registration.scope + ':';
const CACHE = PREFIX + VERSION;
const ASSETS = [
 './', './index.html', './manifest.webmanifest', './pwa.js', './pwa.css',
 './dependency-roots.json', './sala-maquines.html', './icons/icon.svg',
 './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/apple-touch-icon.png'
];
const BASE=new URL(self.registration.scope),INDEX=new URL('./index.html',BASE).href;
const LOCAL=new Set(ASSETS.map(p=>new URL(p,BASE).href));
const MARKER=new URL('./__sala-offline-ready__',BASE).href;
async function config(cache){const r=await cache.match(new URL('./dependency-roots.json',BASE).href);if(!r)throw Error('missing-config');return r.json();}
function remoteAllowed(url,cfg){return url.href.startsWith(cfg.engineRoot)&&url.pathname.endsWith('.js')||url.origin==='https://fonts.googleapis.com'&&url.href===new URL(cfg.fontCss).href||url.origin==='https://fonts.gstatic.com'&&url.pathname.startsWith('/s/ibmplex');}
function sameConfig(marker,cfg){return JSON.stringify(marker.roots)===JSON.stringify(cfg.roots)&&marker.fontCss===cfg.fontCss;}
async function readyMarker(cache,cfg){const r=await cache.match(MARKER);if(!r)return null;const marker=await r.json();if(!sameConfig(marker,cfg)||!cfg.roots.every(url=>marker.urls.includes(url)))return null;for(const url of marker.urls)if(!await cache.match(url,{ignoreVary:true}))return null;return marker;}
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);await cache.addAll(ASSETS.map(p=>new Request(new URL(p,BASE),{cache:'reload'})));
 const cfg=await config(cache);
 // Reuse pinned 3D resources from a verified previous release, including during offline updates.
 for(const key of await caches.keys()){
  if(!key.startsWith(PREFIX)||key===CACHE)continue;
  try{const old=await caches.open(key),marker=await readyMarker(old,cfg);if(!marker)continue;
   for(const url of marker.urls){if(!remoteAllowed(new URL(url),cfg))throw Error('invalid-resource');await cache.put(url,await old.match(url,{ignoreVary:true}));}
   await cache.put(MARKER,new Response(JSON.stringify(marker),{headers:{'Content-Type':'application/json'}}));break;
  }catch{}
 }
 // Updated workers wait until the user chooses to activate them.
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 await Promise.all((await caches.keys()).filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();
})()));
self.addEventListener('message',event=>{
 if(event.data?.type==='ACTIVATE_UPDATE'){event.waitUntil(self.skipWaiting());return;}
 if(!['OFFLINE_STATUS','CACHE_3D'].includes(event.data?.type))return;
 const reply=value=>event.ports?.[0]?.postMessage(value);
 event.waitUntil((async()=>{
  try{
   const cache=await caches.open(CACHE),cfg=await config(cache);
   if(event.data.type==='OFFLINE_STATUS'){reply({ok:true,ready:!!await readyMarker(cache,cfg)});return;}
   const incoming=event.data.urls;
   if(!Array.isArray(incoming)||incoming.length>300)throw Error('invalid-list');
   const urls=[...new Set(incoming)];
   if(!cfg.roots.every(url=>urls.includes(url)))throw Error('incomplete-graph');
   for(const value of urls){const url=new URL(value);if(!remoteAllowed(url,cfg))throw Error('invalid-resource');}
   // Moderate concurrency: cache only resources the current page actually loaded.
   let cursor=0;await Promise.all(Array.from({length:Math.min(4,urls.length)},async()=>{
    while(cursor<urls.length){const url=urls[cursor++];if(await cache.match(url,{ignoreVary:true}))continue;
     const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),30000);
     try{const response=await fetch(url,{mode:'cors',credentials:'omit',signal:controller.signal});if(!response.ok||response.type==='opaque')throw Error('fetch-failed');await cache.put(url,response);}finally{clearTimeout(timer);}
    }
   }));
   await cache.put(MARKER,new Response(JSON.stringify({roots:cfg.roots,fontCss:cfg.fontCss,urls}),{headers:{'Content-Type':'application/json'}}));reply({ok:true,ready:true});
  }catch{reply({ok:false,ready:false});}
 })());
});
self.addEventListener('fetch',event=>{
 const request=event.request;if(request.method!=='GET')return;const url=new URL(request.url);
 if(url.origin===BASE.origin){
  const canonical=new URL(url.href);canonical.search='';canonical.hash='';if(!LOCAL.has(canonical.href))return;
  event.respondWith((async()=>{const cache=await caches.open(CACHE),key=request.mode==='navigate'&&[BASE.href,INDEX].includes(canonical.href)?INDEX:canonical.href;return await cache.match(key)||fetch(request);})());return;
 }
 // Other sites and APIs are never intercepted or cached.
 if(!['https://cdn.jsdelivr.net','https://fonts.googleapis.com','https://fonts.gstatic.com'].includes(url.origin))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE),cfg=await config(cache);if(!remoteAllowed(url,cfg))return fetch(request);
  const hit=await cache.match(url.href,{ignoreVary:true});if(hit)return hit;
  const response=await fetch(request);if(response.ok&&response.type!=='opaque')try{await cache.put(url.href,response.clone());}catch{}return response;
 })());
});
