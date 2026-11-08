[← README](../README.md)

> Guia tècnica detallada / Detailed technical guide. Les ordres referides al projecte font només són aplicables si aquests fitxers hi són; el README descriu els fitxers i les ordres d’aquest repositori.

# Sala de màquines 3YM20 · PWA

[Català](#catala) · [Español](#espanol) · [English](#english)

<a id="catala"></a>
## Català

Versió instal·lable de la sala de màquines del veler en 3D, amb català, español i anglès. Conserva les vuit escenes, el recorregut guiat, les fitxes, els indicadors i el mode de clip del fitxer traduït original. La PWA està preparada en aquesta carpeta, però **disponible a l’enllaç del README**.

### Publicació i instal·lació

1. Puja tot el contingut d’aquesta carpeta, inclosa `icons/`, a un servidor de fitxers estàtics amb **HTTPS i certificat vàlid**. No cal npm ni un servidor d’aplicacions.
2. Pot estar a l’arrel del domini o en una subcarpeta, per exemple `https://el-teu-domini.cat/maquines/`. Conserva la barra final `/`; totes les referències són relatives.
3. El servidor ha de servir els fitxers reals i `index.html` com a índex, sense convertir peticions JS en pàgines HTML. Tipus MIME: `.js` → `text/javascript`, `.css` → `text/css`, `.webmanifest` → `application/manifest+json`, `.json` → `application/json`, `.svg` → `image/svg+xml`, `.png` → `image/png`.
4. Obre l’URL HTTPS amb connexió. A la capçalera, el botó **App** mostra l’estat i les instruccions d’instal·lació.
5. A Android amb Chrome: prem «Instal·la l’app» si apareix, o menú `⋮` → «Afegeix a la pantalla d’inici» / «Instal·la l’aplicació». A iPhone: Safari → Compartir → Afegeix a la pantalla d’inici. Les opcions exactes depenen del navegador.

No cal APK ni sideloading. El servidor ha de permetre carregar Three.js des de `cdn.jsdelivr.net` i les fonts des de `fonts.googleapis.com` i `fonts.gstatic.com`. La càrrega inicial requereix Internet i un navegador amb WebGL. No s’ha desactivat l’aïllament del navegador ni s’han incorporat credencials.

### Ús sense connexió

Aquesta aplicació depèn de **Three.js 0.169.0** i de fonts externes. No n’hi ha prou amb desar l’HTML. La primera vegada:

1. Deixa que l’escena 3D es carregui correctament amb Internet.
2. Espera mentre la PWA desa els mòduls realment carregats de Three.js, les seves dependències i les fonts. Pot descarregar diversos megabytes.
3. Obre **App** i comprova el missatge «Sala 3D preparada per funcionar sense connexió en aquest dispositiu». L’indicador del botó també passa a verd.
4. A partir d’aquell moment pots tornar a obrir aquesta PWA sense Internet, mentre el navegador conservi la memòria cau.

Si falla el CDN, WebGL o la preparació de la memòria cau, no es mostra una confirmació falsa. Connecta’t i prem «Torna-ho a provar»; si l’escena no s’havia carregat, el botó ofereix tornar a carregar la pàgina. El programa només desa recursos de Three.js amb la versió fixada i les fonts IBM Plex de Google; no desa API, navegacions a Yanmar ni altres dominis.

Es conserva la preferència d’idioma, però no l’estat de l’animació: recarregar o tancar i tornar a obrir reinicia el recorregut. El navegador pot eliminar les dades del lloc si l’usuari les esborra o si necessita espai. Caldria tornar a preparar el mode sense connexió.

### Fitxers

- `index.html`: aplicació 3D traduïda amb la PWA integrada.
- `manifest.webmanifest`: identitat, URL inicial, icones i finestra independent.
- `pwa.js`, `pwa.css`: instal·lació, estat, preparació sense connexió i actualitzacions, en tres idiomes.
- `sw.js`: memòria cau versionada i comprovació dels recursos 3D.
- `dependency-roots.json`: mòduls d’entrada i versió de Three.js. La resta del graf de dependències s’obté dels recursos carregats pel navegador.
- `icons/`: PNG de 192, 512 i 180 px, icona maskable de 512 px i original SVG.
- `sala-maquines.html`: còpia del fitxer traduït original, independent dels fitxers PWA. Aquesta còpia continua fent servir els CDN i no és, per si sola, una versió 3D sense connexió.
- `actualitza-versio.mjs`, `VERSION.txt`: eina i identificador de versió.
- `prova-local.sh`: servidor local de proves amb Python 3.
- `_headers`: capçaleres opcionals per a allotjaments compatibles; configura `sw.js` perquè es revalidi quan publiquis canvis.
- `tests-pwa.mjs`: proves automàtiques sense dependències.

### Proves i actualitzacions

Per provar-la al mateix ordinador:

```bash
./prova-local.sh
```

Obre `http://localhost:8000/`. `localhost` és una excepció de desenvolupament per als service workers; al mòbil cal **HTTPS**, no un fitxer `file://` ni una IP local amb HTTP.

Després d’editar els fitxers, amb Node.js instal·lat:

```bash
node actualitza-versio.mjs
node tests-pwa.mjs
```

Publica tot el conjunt, preferentment amb un desplegament atòmic. L’eina sincronitza la configuració de dependències incrustada a l’HTML i recalcula la versió. Si canvies els imports o la versió de Three.js, actualitza també `dependency-roots.json`. La PWA mostra «Actualització disponible» i només recarrega la finestra quan l’usuari prem «Actualitza i reinicia». Si els imports continuen sent els mateixos, la nova memòria cau reutilitza els recursos 3D verificats de la versió anterior, també per permetre actualitzar sense connexió.

Les proves cobreixen el manifest, les icones, la integritat de les escenes, el graf 3D complet, els errors, els orígens permesos, les actualitzacions i els tres idiomes. Utilitzen API de navegador simulades. Les captures del README s’han generat en Chromium amb càrrega real del CDN. La instal·lació física en Android no s’ha verificat. Després de publicar-la, comprova la instal·lació, la preparació completa, el mode avió, el canvi d’idioma i les actualitzacions al mòbil.

<a id="espanol"></a>
## Español

Versión instalable de la sala de máquinas del velero en 3D, con catalán, español e inglés. Conserva las ocho escenas, el recorrido guiado, las fichas, los indicadores y el modo de clip del archivo traducido original. La PWA está preparada en esta carpeta, pero **disponible en el enlace del README**.

### Publicación e instalación

1. Sube todo el contenido de esta carpeta, incluida `icons/`, a un servidor de archivos estáticos con **HTTPS y certificado válido**. No hace falta npm ni un servidor de aplicaciones.
2. Puede estar en la raíz del dominio o en una subcarpeta, por ejemplo `https://tu-dominio.es/maquinas/`. Conserva la barra final `/`; todas las referencias son relativas.
3. El servidor debe servir los archivos reales e `index.html` como índice, sin convertir peticiones JS en páginas HTML. Tipos MIME: `.js` → `text/javascript`, `.css` → `text/css`, `.webmanifest` → `application/manifest+json`, `.json` → `application/json`, `.svg` → `image/svg+xml`, `.png` → `image/png`.
4. Abre la URL HTTPS con conexión. El botón **App** de la cabecera muestra el estado y las instrucciones de instalación.
5. En Android con Chrome: pulsa «Instala la app» si aparece, o menú `⋮` → «Añadir a pantalla de inicio» / «Instalar aplicación». En iPhone: Safari → Compartir → Añadir a pantalla de inicio. Las opciones exactas dependen del navegador.

No hace falta APK ni sideloading. El servidor debe permitir cargar Three.js desde `cdn.jsdelivr.net` y las fuentes desde `fonts.googleapis.com` y `fonts.gstatic.com`. La carga inicial requiere Internet y un navegador con WebGL. No se ha desactivado el aislamiento del navegador ni se han incorporado credenciales.

### Uso sin conexión

Esta aplicación depende de **Three.js 0.169.0** y de fuentes externas. No basta con guardar el HTML. La primera vez:

1. Deja que la escena 3D se cargue correctamente con Internet.
2. Espera mientras la PWA guarda los módulos de Three.js realmente cargados, sus dependencias y las fuentes. Puede descargar varios megabytes.
3. Abre **App** y comprueba el mensaje «Sala 3D preparada para funcionar sin conexión en este dispositivo». El indicador del botón también pasa a verde.
4. A partir de ese momento puedes volver a abrir esta PWA sin Internet, mientras el navegador conserve la caché.

Si falla el CDN, WebGL o la preparación de la caché, no se muestra una confirmación falsa. Conéctate y pulsa «Vuelve a intentarlo»; si la escena no se había cargado, el botón ofrece volver a cargar la página. El programa solo guarda recursos de Three.js con la versión fijada y las fuentes IBM Plex de Google; no guarda API, navegaciones a Yanmar ni otros dominios.

Se conserva la preferencia de idioma, pero no el estado de la animación: recargar o cerrar y volver a abrir reinicia el recorrido. El navegador puede eliminar los datos del sitio si el usuario los borra o si necesita espacio. Sería necesario preparar de nuevo el modo sin conexión.

### Archivos

- `index.html`: aplicación 3D traducida con la PWA integrada.
- `manifest.webmanifest`: identidad, URL inicial, iconos y ventana independiente.
- `pwa.js`, `pwa.css`: instalación, estado, preparación sin conexión y actualizaciones, en tres idiomas.
- `sw.js`: caché versionada y comprobación de los recursos 3D.
- `dependency-roots.json`: módulos de entrada y versión de Three.js. El resto del grafo de dependencias se obtiene de los recursos cargados por el navegador.
- `icons/`: PNG de 192, 512 y 180 px, icono maskable de 512 px y original SVG.
- `sala-maquines.html`: copia del archivo traducido original, independiente de los archivos PWA. Esta copia sigue utilizando los CDN y, por sí sola, no es una versión 3D sin conexión.
- `actualitza-versio.mjs`, `VERSION.txt`: herramienta e identificador de versión.
- `prova-local.sh`: servidor local de pruebas con Python 3.
- `_headers`: cabeceras opcionales para alojamientos compatibles; configura `sw.js` para que se revalide al publicar cambios.
- `tests-pwa.mjs`: pruebas automáticas sin dependencias.

### Pruebas y actualizaciones

Para probarla en el mismo ordenador:

```bash
./prova-local.sh
```

Abre `http://localhost:8000/`. `localhost` es una excepción de desarrollo para los service workers; en el móvil hace falta **HTTPS**, no un archivo `file://` ni una IP local con HTTP.

Después de editar los archivos, con Node.js instalado:

```bash
node actualitza-versio.mjs
node tests-pwa.mjs
```

Publica todo el conjunto, preferiblemente con un despliegue atómico. La herramienta sincroniza la configuración de dependencias incrustada en el HTML y recalcula la versión. Si cambias los imports o la versión de Three.js, actualiza también `dependency-roots.json`. La PWA muestra «Actualización disponible» y solo recarga la ventana cuando el usuario pulsa «Actualiza y reinicia». Si los imports siguen siendo los mismos, la nueva caché reutiliza los recursos 3D verificados de la versión anterior, también para permitir actualizar sin conexión.

Las pruebas cubren el manifiesto, los iconos, la integridad de las escenas, el grafo 3D completo, los errores, los orígenes permitidos, las actualizaciones y los tres idiomas. Utilizan API de navegador simuladas. Las capturas del README se han generado en Chromium con carga real del CDN. No se ha verificado la instalación en un dispositivo Android. Después de publicarla, comprueba la instalación, la preparación completa, el modo avión, el cambio de idioma y las actualizaciones en el móvil.

<a id="english"></a>
## English

Installable version of the sailboat’s 3D engine room, with Catalan, Spanish and English. It preserves the eight scenes, guided tour, component details, indicators and clip mode from the original translated file. The PWA is ready in this folder, but **is available through the README link**.

### Publishing and installing

1. Upload all the contents of this folder, including `icons/`, to a static file server with **HTTPS and a valid certificate**. No npm or application server is needed.
2. It can run at the domain root or in a subfolder, such as `https://your-domain.com/engine-room/`. Keep the trailing `/`; all references are relative.
3. The server must serve the actual files and use `index.html` as its directory index, without replacing JS requests with HTML pages. MIME types: `.js` → `text/javascript`, `.css` → `text/css`, `.webmanifest` → `application/manifest+json`, `.json` → `application/json`, `.svg` → `image/svg+xml`, `.png` → `image/png`.
4. Open the HTTPS URL while connected. The **App** button in the header shows the status and installation instructions.
5. On Android with Chrome: press “Install app” if available, or use the `⋮` menu → “Add to home screen” / “Install app”. On iPhone: Safari → Share → Add to Home Screen. Exact options depend on the browser.

No APK or sideloading is needed. The server must allow Three.js from `cdn.jsdelivr.net` and fonts from `fonts.googleapis.com` and `fonts.gstatic.com`. Initial loading requires Internet access and a WebGL-capable browser. Browser isolation has not been disabled, and no credentials are included.

### Offline use

This application depends on **Three.js 0.169.0** and external fonts. Saving the HTML alone is not enough. On first use:

1. Let the 3D scene load successfully with an Internet connection.
2. Wait while the PWA saves the Three.js modules actually loaded, their dependencies and the fonts. This may download several megabytes.
3. Open **App** and check for “The 3D engine room is ready for offline use on this device.” The button’s indicator also turns green.
4. You can then reopen this PWA without Internet access, as long as the browser retains its cache.

If the CDN, WebGL or cache setup fails, the app does not show a false confirmation. Connect and press “Try again”; if the scene never loaded, the button offers to reload the page. The app only stores pinned Three.js resources and Google’s IBM Plex fonts; it does not store API requests, navigation to Yanmar or other domains.

Your language preference is saved, but animation state is not: reloading, or closing and reopening, restarts the walkthrough. The browser may remove site data if you clear it or if storage space is needed. Offline setup would then need to be completed again.

### Files

- `index.html`: translated 3D application with PWA integration.
- `manifest.webmanifest`: identity, start URL, icons and standalone window.
- `pwa.js`, `pwa.css`: installation, status, offline setup and update controls in three languages.
- `sw.js`: versioned cache and 3D resource checks.
- `dependency-roots.json`: entry modules and Three.js version. The rest of the dependency graph comes from resources loaded by the browser.
- `icons/`: 192, 512 and 180 px PNG icons, a 512 px maskable icon and the SVG source.
- `sala-maquines.html`: copy of the original translated file, independent of the PWA files. This copy still uses CDNs and is not, by itself, an offline 3D version.
- `actualitza-versio.mjs`, `VERSION.txt`: versioning tool and identifier.
- `prova-local.sh`: local test server using Python 3.
- `_headers`: optional headers for compatible hosting services; configure `sw.js` to be revalidated when publishing changes.
- `tests-pwa.mjs`: automated tests with no dependencies.

### Testing and updates

To test on the same computer:

```bash
./prova-local.sh
```

Open `http://localhost:8000/`. `localhost` is a development exception for service workers; on a phone, use **HTTPS**, not a `file://` file or a local IP address over HTTP.

After editing the files, with Node.js installed:

```bash
node actualitza-versio.mjs
node tests-pwa.mjs
```

Publish the complete set, preferably using an atomic deployment. The tool synchronizes the dependency configuration embedded in the HTML and recalculates the version. If you change the imports or Three.js version, update `dependency-roots.json` too. The PWA shows “Update available” and only reloads the window when you press “Update and restart”. If the imports remain unchanged, the new cache reuses verified 3D resources from the previous version, allowing offline updates too.

Tests cover the manifest, icons, scene integrity, complete 3D graph, errors, allowed origins, updates and all three languages. They use simulated browser APIs. **A live CDN download and a real Android installation could not be tested from this environment.** After publishing, check installation, complete offline setup, airplane mode, language switching and updates on your phone.

---

Three.js: [source and MIT license](https://github.com/mrdoob/three.js). Fonts: [IBM Plex](https://github.com/IBM/plex). [Service worker cache documentation](https://developer.mozilla.org/en-US/docs/Web/API/Cache/put).
