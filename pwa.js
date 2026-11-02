(() => {
'use strict';
const messages={
 ca:{open:'Instal·lació i ús sense connexió',title:'Sala de màquines 3YM20',close:'Tanca',install:'Instal·la l’app',retry:'Torna-ho a provar',reload:'Torna a carregar',update:'Actualització disponible',apply:'Actualitza i reinicia',later:'Més tard',installed:'App instal·lada.',secure:'Obre la pàgina amb HTTPS per instal·lar-la i preparar el mode sense connexió. localhost serveix per fer proves al mateix ordinador.',waiting:'Carrega l’escena 3D amb Internet abans de preparar el mode sense connexió.',preparing:'Desant el motor 3D i els seus recursos per fer-los servir sense connexió…',ready:'Sala 3D preparada per funcionar sense connexió en aquest dispositiu.',offline:'Sense connexió. La sala 3D està disponible des de la memòria cau.',incomplete:'El mode sense connexió encara no està complet. Connecta’t a Internet i torna-ho a provar.',failed:'No s’han pogut desar tots els recursos 3D. Pots continuar amb connexió i tornar-ho a provar.',guide:'Android · Chrome: menú ⋮ → Afegeix a la pantalla d’inici o Instal·la l’aplicació.\niPhone · Safari: Compartir → Afegeix a la pantalla d’inici.\nAbans d’utilitzar-la sense Internet, espera la confirmació que la sala 3D està preparada.',updateText:'La versió nova tornarà a carregar la pàgina i reiniciarà el recorregut. Pots continuar amb la versió actual i actualitzar més tard.'},
 es:{open:'Instalación y uso sin conexión',title:'Sala de máquinas 3YM20',close:'Cerrar',install:'Instala la app',retry:'Vuelve a intentarlo',reload:'Vuelve a cargar',update:'Actualización disponible',apply:'Actualiza y reinicia',later:'Más tarde',installed:'App instalada.',secure:'Abre la página con HTTPS para instalarla y preparar el modo sin conexión. localhost sirve para pruebas en el mismo ordenador.',waiting:'Carga la escena 3D con Internet antes de preparar el modo sin conexión.',preparing:'Guardando el motor 3D y sus recursos para usarlos sin conexión…',ready:'Sala 3D preparada para funcionar sin conexión en este dispositivo.',offline:'Sin conexión. La sala 3D está disponible desde la caché.',incomplete:'El modo sin conexión aún no está completo. Conéctate a Internet y vuelve a intentarlo.',failed:'No se han podido guardar todos los recursos 3D. Puedes continuar con conexión y volver a intentarlo.',guide:'Android · Chrome: menú ⋮ → Añadir a pantalla de inicio o Instalar aplicación.\niPhone · Safari: Compartir → Añadir a pantalla de inicio.\nAntes de usarla sin Internet, espera la confirmación de que la sala 3D está preparada.',updateText:'La nueva versión recargará la página y reiniciará el recorrido. Puedes continuar con la versión actual y actualizar más tarde.'},
 en:{open:'Installation and offline use',title:'3YM20 engine room',close:'Close',install:'Install app',retry:'Try again',reload:'Reload page',update:'Update available',apply:'Update and restart',later:'Later',installed:'App installed.',secure:'Open this page over HTTPS to install it and prepare offline mode. localhost works for testing on the same computer.',waiting:'Load the 3D scene with an Internet connection before preparing offline mode.',preparing:'Saving the 3D engine and its resources for offline use…',ready:'The 3D engine room is ready for offline use on this device.',offline:'Offline. The 3D engine room is available from the cache.',incomplete:'Offline setup is not complete yet. Connect to the Internet and try again.',failed:'Some 3D resources could not be saved. You can continue online and try again.',guide:'Android · Chrome: ⋮ menu → Add to home screen or Install app.\niPhone · Safari: Share → Add to Home Screen.\nBefore using it without Internet, wait for confirmation that the 3D engine room is ready.',updateText:'The new version will reload the page and restart the walkthrough. You can keep using this version and update later.'}
};
const el=id=>document.getElementById(id),text=()=>messages[document.documentElement.lang]||messages.ca;
let registration=null,promptEvent=null,offlineReady=false,busy=false,failed=false,reloadRequested=false;
let installed=window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const secure=window.isSecureContext&&['https:','http:'].includes(location.protocol);
function render(){
 const t=text();el('pwa-open').setAttribute('aria-label',t.open);el('pwa-title').textContent=t.title;el('pwa-close').setAttribute('aria-label',t.close);el('pwa-install').textContent=t.install;
 el('pwa-retry').textContent=window.__salaReady?t.retry:t.reload;el('pwa-update').textContent=t.update;el('pwa-apply').textContent=t.apply;el('pwa-later').textContent=t.later;
 el('pwa-guide').textContent=t.guide;el('pwa-update-text').textContent=t.updateText;
 el('pwa-status').textContent=(installed?t.installed+' ':'')+(!secure?t.secure:offlineReady?(navigator.onLine===false?t.offline:t.ready):busy?t.preparing:failed?t.failed:navigator.onLine===false?t.incomplete:t.waiting);
 el('pwa-install').hidden=!promptEvent||installed;el('pwa-update').hidden=!registration?.waiting;el('pwa-retry').hidden=!secure||offlineReady;el('pwa-retry').disabled=busy;
 el('pwa-dot').classList.toggle('ready',offlineReady);
}
function message(type,extra={}){
 return new Promise((resolve,reject)=>{
  const target=registration?.active;if(!target){reject(Error('no-worker'));return;}
  const channel=new MessageChannel(),timer=setTimeout(()=>{channel.port1.close();reject(Error('timeout'));},120000);
  channel.port1.onmessage=event=>{clearTimeout(timer);channel.port1.close();resolve(event.data);};
  target.postMessage({type,...extra},[channel.port2]);
 });
}
function config(){return JSON.parse(document.getElementById('pwa-dependencies').textContent);}
function allowed(value,cfg){try{const url=new URL(value);return url.href.startsWith(cfg.engineRoot)&&url.pathname.endsWith('.js')||url.origin==='https://fonts.googleapis.com'&&url.href===new URL(cfg.fontCss).href||url.origin==='https://fonts.gstatic.com'&&url.pathname.startsWith('/s/ibmplex');}catch{return false;}}
async function prepareOffline(){
 if(!registration?.active||!window.__salaReady||busy||offlineReady||navigator.onLine===false){render();return;}
 busy=true;failed=false;render();
 try{
  if(document.fonts?.ready)await document.fonts.ready;
  const cfg=config(),resources=performance.getEntriesByType('resource').map(entry=>entry.name).filter(url=>allowed(url,cfg));
  // Refuse to report offline readiness if the module graph was not fully observed.
  if(!cfg.roots.every(url=>resources.includes(url)))throw Error('incomplete-resource-timing');
  const result=await message('CACHE_3D',{urls:[...new Set(resources)]});if(!result.ok||!result.ready)throw Error('cache-failed');offlineReady=true;
 }catch{failed=true;}finally{busy=false;render();}
}
el('pwa-open').onclick=()=>{render();el('pwa-dialog').showModal();};el('pwa-close').onclick=()=>el('pwa-dialog').close();
el('pwa-retry').onclick=()=>{if(!window.__salaReady)location.reload();else prepareOffline();};
el('pwa-update').onclick=()=>{el('pwa-confirm').hidden=false;};el('pwa-later').onclick=()=>{el('pwa-confirm').hidden=true;};
el('pwa-apply').onclick=()=>{if(!registration?.waiting)return;reloadRequested=true;registration.waiting.postMessage({type:'ACTIVATE_UPDATE'});el('pwa-dialog').close();};
el('pwa-install').onclick=async()=>{const pending=promptEvent;if(!pending)return;promptEvent=null;render();try{await pending.prompt();const result=await pending.userChoice;if(result.outcome==='accepted')installed=true;}catch{}render();};
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();promptEvent=event;render();});
window.addEventListener('appinstalled',()=>{installed=true;promptEvent=null;render();});
window.addEventListener('sala-languagechange',render);
window.addEventListener('sala-ready',prepareOffline);
window.addEventListener('offline',render);
window.addEventListener('online',()=>{render();prepareOffline();registration?.update().catch(()=>{});});
if('serviceWorker' in navigator&&secure){
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloadRequested)location.reload();});
 navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}).then(async reg=>{
  registration=reg;reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed')setTimeout(render,0);});});
  await navigator.serviceWorker.ready;
  const status=await message('OFFLINE_STATUS');offlineReady=!!status.ready;render();if(!offlineReady)prepareOffline();
 }).catch(()=>{failed=true;render();});
}
render();
})();
