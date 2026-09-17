# HISTORY — pocallum.cat

Registre de sessions de treball i canvis rellevants.

---

## 2026-09-17 (migdia) — Accessibilitat WCAG arreglada + visites per dia de la setmana al dashboard

**♿ Accessibilitat: 0 controls sense nom accessible — commit `a70cd580`**
- L'auditoria externa donava 79/100 amb dos fails WCAG 2.2 AA: 4 enllaços sense nom accessible i 4 amb text genèric. Eren els mateixos 4: les imatges-enllaç de les targetes de notícies de la portada i l'email ofuscat del peu.
- Fix: `aria-label` amb el títol a l'enllaç d'imatge de `index.html`; text de reserva dins `<span data-contact-text>` a tots els enllaços d'email ofuscat buits (peu, contacte ×2, avis legal CA/EN, privacitat CA/EN) — el JS substitueix el span per l'email real, sense JS hi ha nom accessible i l'adreça no es filtra als scrapers.
- Creades les claus i18n `contact_email_label` / `contact_tel_label`. Corregit també `renderBars` del dashboard (max calculat sobre tots els items, no el primer).
- Verificat amb parser propi: 0 enllaços sense nom a portada, contacte, legal, notícies i EN; el desxiframent JS segueix funcionant.

**📊 Dashboard: bloc «Visites per dia de la setmana» — commit `7bf58a4d`**
- Nova secció a la pestanya Temporal, sota la gràfica: barres Dilluns→Diumenge amb el percentatge sobre el total del període sempre visible, més línia de resum («Dia amb més impacte: X (N% de les visites)»).
- Reacciona al període seleccionat (7d/30d/3m/1a), calculat al client des de `hits_by_day` — sense canvis al pipeline d'analytics.
- Verificat en navegador (bypass del login via CDP): ordre, percentatges i amplades correctes.

**🖼️ Galeria: 2 retrats de Kaori — commit `5df71ef4`**
- `Kaori-2011-IMG_0850.jpg` (2011-08-03, apaïsada) i `Kaori-2016-IMG_4278.jpg` (2016-06-28, vertical) de l'escriptori → `static/images/galeria/` amb la convenció de data-EXIF + nom, pipeline WebP (800/1600), i dues entrades `servei: "artistes"` a `content/ca/galeria/`. Detalls i variants webp verificats en viu (200).

## 2026-09-17 (tarda) — Miniatures CMS arreglades + pestanya Missatges al dashboard

Sessió de continuïtat. Dos blocs: fix de les miniatures del CMS Sveltia a `/admin/` i nova pestanya "Missatges" al dashboard de `/stats/` que llegeix el registre de leads del formulari.

- **Miniatures CMS — causa arrel:** els camps `image:` del contingut apunten a `/images/...`, però el `config.yml` de Sveltia tenia `media_folder: "static/media"` / `public_folder: "/media"` → els fitxers carregats pel CMS i els resolts pel lloc no es trobaven → cap miniatura als llistats. Fix: alinear a la ubicació real — `media_folder: "static/images"`, `public_folder: "/images"` (els hints CA/EN dels camps d'imatge també actualitzats de `/media/` a `/images/`). Com que la CSP de `/admin/` ja permetia `*.githubusercontent.com`, les miniatures es carreguen de GitHub directament. Commit `f8d1a75`.
- **Pestanya Missatges a `/stats/`:** nova pestanya que llista els leads del formulari (nous/llegits/fets) amb botó per marcar-los com a llegits, tot sense sortir del dashboard. El login del dashboard guarda la contrasenya a `sessionStorage` i s'envia com a `X-Auth-Token`.
- **Endpoint privat `static/missatges.php`:** GET llista els leads (parseja frontmatter + `_cos`, ordena per data desc, comptador de nous), POST marca `llegit`/`fet` modificant la línia `estat:` al fitxer. Auth server-side estricta, rate-limit 20/h per IP, headers no-store contra la cache de Dinahosting.
- **Auth sense secret extra:** l'endpoint accepta com a token la dues vegades sha256 de la contrasenya del dashboard; el servidor en guarda el hash públic (`hash_equals`), inútil per preimatge. Ambdues capes (server-side 401 + client-side al dashboard) usen la mateixa contrasenya.
- **Trags de producció resolts sobre la marxa:**
  - Dinahosting/PHP-FPM **no** exposa `Authorization` a `$_SERVER` → capçalera custom `X-Auth-Token` (commit `195364b`).
  - Els fitxers de leads es diuen `data-YYYYMMDD-HHMMSS-slug.md` → la cerca per prefix de nom del fitxer fallava; ara cada MD es parseja i es cerca pel frontmatter `id:` (commit `5779c21`).
- **Verificació end-to-end a producció:** 401 sense token, 401 amb el hash sol (cal la contrasenya real), 200 + llista de leads amb token, POST `llegit` 200 i fitxer actualitzat. Token de prova esborrat, `pwHash` real restaurat, lead de prova i fitxers de rate-limit netejats del servidor.
- **Config secrets al servidor:** `~/leads/.control/.missatges-token-hash` (mode 660) conté el `pwHash` — és l'única credencial que necessita l'endpoint, i és pública sense risc (preimage resistance).
- **Canvi d'uploads CMS pels editors:** els fitxers pujats des de `/admin/` ara van a `static/images/` (no a `/media/`).
- Commits: `f8d1a75`, `195364b`, `5779c21`.

---

## 2026-09-17 — Formulari de contacte propi (fi de Formspree)

Sessió llarga. El wizard de `/contacte/` deixa d'enviar a Formspree i passa a l'endpoint propi `static/formulari.php`, allotjat a Dinahosting. Resposta JSON `{ok:bool}`, filtres anti-spam en capes (honeypot, `_ts` ≥4 s, rate-limit 5/60 min per IP, validació email + dominis temporals + heurística URLs), registre de leads en Markdown a `~/leads/` i notificació per mail. Aprovació explícita de l'usuari: leads al servidor, sense tercers, casella de consentiment no premarcada (obligatòria), retenció 24 mesos, finalitat només contacte directe.

- **Risc trobat:** el proxy de Dinahosting cacheja respostes POST per URL — primeres proves amb `formulari.php` retornaven sempre el mateix `{ok:true}` del cau. Resolt amb headers `no-store`/`no-cache`/`must-revalidate` + `Pragma: no-cache` (al PHP i al `.htaccess` dins `<FilesMatch formulari\.php$>`).
- **Incident 500:** un `</IfModule>` sobrant al `.htaccess` va provocar 500 a totes les peticions del formulari (log: `<IfModule> without matching section`). Corregit, verificat end-to-end: 422 sense consentiment, 200 silenciós (honeypot/temporal), 200 + registre `.md` per enviament real. Lleads de prova netejats del servidor.
- **Legals:** `privacitat.md` i `cookies.md` (CA+EN) actualitzats — endpoint propi, retenció 24 mesos, finalitat clara, sense Tally.so ni tercers.
- **Docs:** `CLAUDE.md`, `AGENTS.md`/`AGENTS.en.md` i `MIGRACIO-DINAHOSTING.md` actualitzats (nova secció "Formulari de contacte (leads)").
- Nota: durant les proves es van enviar 2 correus reals a `hola@pocallum.cat` (subject "Nou pressupost — pocallum.cat", Reply-To dels tests) — descartables.

---

## PENDENT — Llegibilitat resultats de cerca (anotat 17/09/2026)

Als resultats de la cerca (Pagefind) cal posar un **fons semi-transparent** perquè es llegeixin bé sobre el fons de la pàgina, amb **marges dret i esquerra**.

- Espera aprovació explícita del disseny abans d'implementar (regla del projecte).

---

## PENDENT — Notícia festivals (anotat 16/09/2026)

Escriure una/unes notícia nova al web amb els concerts coberts de:

- **MASiMAS Balkan Reunion** (Festival MASiMAS 2026)
- **Recordant el Paral·lel** (Merche Mar Emporium / Parallel 62)

**✔ FET (16/09/2026):** `content/ca/noticies/2026-07-masimas-balkan-reunion.md` + `content/en/` i `content/ca/noticies/2026-09-el-parallel-oblidat.md` + `content/en/` creats.

---

## 2026-09-16 (tarda) — Cerca trencada per la CSP, auditoria de seguretat i neteja del servidor

**🔍 Cerca (`/cerca/`) no trobava res — causa arrel: CSP sense `'wasm-unsafe-eval'`**
- Símptoma: la UI de Pagefind es queda penjada a «Cercant…» per sempre, 0 resultats. Reproduït en producció i en local (Chrome headless + CDP).
- Diagnosi: el worker de Pagefind (`/pagefind/pagefind-worker.js`) fa `WebAssembly.instantiate()` del seu índex; la CSP del `.htaccess` no permetia WASM → `CompileError` dins el worker (invisible a la UI, que fa polling infinit). L'índex sempre ha estat ben desplegat (495 pàgines ca + 259 en).
- Fix: `'wasm-unsafe-eval'` afegit a `script-src` a `static/.htaccess` (font de veritat, desplegada per rsync) i al `~/www/.htaccess` del servidor (ja en viu). `static/_headers` (referència GH Pages) sincronitzat.
- **Lliçó edge cache**: Dinahosting té un caché edge per variant de compressió que servia els fitxers `immutable` amb la CSP VELLA encara que l'origin ja la tenia nova (curl sense `Accept-Encoding` → CSP nova; amb `gzip/br` → CSP vella, `age:` creixent). Sense purga HTTP (PURGE→405, BAN→501). **Cal buidar el caché des del panell de Dinahosting.**
- Prevenció: fitxers de `/pagefind/` (noms estables: `pagefind.js`, `pagefind-worker.js`, `wasm.*.pagefind`, `*.pf_meta|pf_fragment|pf_index`, `pagefind-entry.json`) ara amb `Cache-Control: public, max-age=3600` en comptes d'`immutable` 1 any (regla `FilesMatch` específica DESPRÉS de la general css/js per sobreescrivir-la). Els css/js amb hash del tema segueixen immutable.
- **✔ Resolt (16/09, tarda):** purga del caché Varnish feta des del panell de Dinahosting (l'edge és **Varnish**, preset «WordPress», TTL 15 min — gestionable a Administració del domini → caché). Commit `54848d1` desplegat (deploy ✓ 36s) i **verificació final en producció** amb navegador verge: «96 resultats trobats per jazz». L'entry.json i els pf_meta coincideixen post-deploy. Visitants que hagin usat la cerca durant el període trencat tenen el worker a la caché `immutable` del navegador → un refresh fort un cop; a partir d'ara ja no passa (cache 1h).

**🔒 Header injection (CRLF) al formulari — commit `4be5c46`**
- El camp `nom` entrava a la capçalera `Reply-To` sense netejar `\r\n` →possible injectar capçaleres (probablement explotable per spam). Test en viu amb `\r\nBcc:` retornava 200.
- Fix a `static/formulari.php`: funció `h()` (elimina `\r`, `\n`, `\0`) aplicada a tots els camps que van a capçaleres (`subject`, `to`, `From`, `Reply-To`). `php -l` OK, desplegat i retestejat.

**📧 Ofuscació d'email completada — commit `936c8b2`**
- Eliminat tot l'email en clar del build: FAQ de serveis (CA+EN, prosa + JSON-LD), avis legal i privacitat (CA+EN), notícies (CA+EN), `contacte/_index.md` (filtrava a l'RSS global), fallback JS del wizard (`mailto:` literal → redirecció a `/contacte/`).
- `main.js` refinat: el desxifrador `[data-contact]` només omple `textContent` si hi ha `[data-contact-text]` o element buit.

**🧹 `~/arxiu-imatges` esborrat (2,3 GB)**
- Baixat via rsync per revisar-lo (antic `wp-content/uploads` 2010–2026), confirmat amb el propietari i esborrat del servidor i de local. `~/www` (2 GB) intacte.

**🛡️ Auditoria de seguretat externa: 100/100, grau A**
- Headers (CSP, HSTS, XFO, nosniff, Referrer-Policy, Permissions-Policy), TLS 1.3, redirect HTTPS, fitxers sensibles inaccessibles: tot PASS.
- Queden pendents d'accessibilitat de la mateixa auditoria: **4 controls sense nom accessible** i **4 enllaços amb text genèric** (WCAG 2.2 AA).
- Troballes pròpies pendents de decidir: `/admin/` (Sveltia CMS) públic amb `config.yml` exposat (sense secrets — el PAT viu al navegador); residuals a la CSP (`frame-src tally.so` sense ús, `connect-src`/`img-src` de vimeo — vimeo sí que s'usa a notícies via iframe de `player.vimeo.com`); `formulari.php` sense rate-limit ni CSRF (mitigat pel honeypot).

**CMS operatiu:** `https://pocallum.cat/admin/` amb Sveltia + PAT fine-grained de GitHub (Contents RW) — verificat funcionant.

---

## 2026-09-16 — Landing del blog a /el-blog/, GA4 for a, humans.txt i robots.txt

**Landing del blog /blog/ → /el-blog/**
- La pàgina de presentació del blog es mou de `/blog/` a `/el-blog/` (CA + EN) — commit `db0ac79`.
- El directori del layout s'ha de dir EXACTAMENT com la secció: `themes/pocallum/layouts/blog/` → `themes/pocallum/layouts/el-blog/`. El camp `layout:` del frontmatter no és suficient.
- Menús (CA + EN) actualitzats a `/el-blog/`. `/blog/` ara es bloqueja a `robots.txt` (`Disallow: /blog/`).

**Google Analytics 4 eliminat — commit `84c074d`**
- Fora `ga4Id = "G-ZV007Q0CKG"` (GA4 cross-domain amb blog) de `hugo.toml` i tot el bloc `{{ with .Site.Params.ga4Id }}...{{ end }}` de `themes/pocallum/layouts/partials/head.html` (línies 296-307).
- Motiu: era codi mort — el CSP de `static/.htaccess` no inclou `googletagmanager.com` i Brave el bloqueja de sèrie. GoatCounter (pròpies estadístiques) es manté.

**humans.txt actualitzat — commit `cba96c2`**
- `Technology: GitHub Pages` → `Dinahosting`; `Last update: 2026-05` → `2026-09`.

**⚠️ robots.txt: el controla el panell de Dinahosting, NO el rsync**
- El rsync puja `static/robots.txt` al docroot, però el **SEO Toolkit del panell** el regenera/sobreescriu amb `User-agent: *` (o el contingut del seu camp).
- Evidència: marca `# SIGNAT-PROVA-20260916` afegida al `static/robots.txt` (commit `bf986ba`), desplegada i → **no va aparèixer en viu**; el `Last-Modified` quedava al moment del darrer toc del panell.
- Flux del panell: SEO Toolkit → robots.txt → editar el camp amb el contingut DESITJAT i clicar **Subir** (puja el text del camp a la ruta marcada, `www`). El botó **Restaurar** torna a la versió generada per ell.
- La marca de prova es treu de `static/robots.txt` (commit `cb9cee4`), però el contingut en viu segueix depenent del panell.

---

## 2026-09-14 — Redirect de la notícia Jazz I Am

Aplicada i validada la correcció de la URL morta detectada a analytics:

- `/en/jazz-i-am-2026-when-a-small-festival-has-more-to-say-than-a-big-one/`
- Redirect cap a `/en/noticies/2026-03-jazz-i-am-2026/`

L’alias del frontmatter anglès s’ha definit sense el prefix `/en`, perquè Hugo ja l’afegeix per a aquest idioma. Amb el prefix duplicat es generava erròniament `/en/en/...`. Build de producció validada amb `hugo --minify`.

---

## 2026-09-16 — Formulari de contacte: Formspree → PHP mail() propi

**Canvi:** el formulari de contacte (wizard natiu 4 passos) ja no depèn de Formspree. Ara envia des del mateix hosting.

- Creat `static/formulari.php` — rep el POST del wizard, valida (honeypot `_gotcha` + email obligatori) i envia amb php `mail()` (sense credencials, MTA de Dinahosting). Retorna JSON `{"ok":true}` per mantenir el contracte del JS.
- `hugo.toml`: `formspreeContact` eliminat → `contactEndpoint = "/formulari.php"`.
- `themes/pocallum/layouts/contacte/list.html`: l'`action` del form apunta ara a `contactEndpoint`.
- **Docs legals actualitzats** (`privacitat.md`, `cookies.md`, CA+EN): del Tally.so/Formspree (que ja no s'usaven) a "formulari propi del lloc, dades enviades per email des del nostre allotjament".
- Compte amb la CSP: el fetch a `/formulari.php` és same-origin → permès per `connect-src 'self'`.
- Veure també secció "robots.txt — el controla el panell" d'aquesta data.

---

## 2026-09-13 — Filtre antispam Formspree a Dinahosting

Sessió curta. Emails de `formspree.io` (recordatoris de curs) anaven a spam. Creat filtre des del Panel de Control de Dinahosting per whitelistar el domini `formspree.io`. El formulari de `pocallum.cat` és Tally.so i no estava afectat.

---

## 2026-09-12 — WebP image pipeline complet

Implementació completa del pipeline WebP per a totes les imatges de contingut.

**Script de conversió**
- `scripts/convert-images.sh` — converteix JPEGs a WebP (full + 800px + 1600px, q85)
- Idempotent, suporta `--force` i argument de fitxer individual
- Dep: ImageMagick (`brew install imagemagick`)

**Partial `picture.html`**
- Nou partial que substitueix tots els `<img>` de contingut
- Genera `<picture>` amb `<source type="image/webp">` i srcset responsive
- Fallback JPEG automàtic per a navegadors antics
- El lightbox continua apuntant al JPEG original (màxima qualitat)

**Templates actualitzats**
- `partials/foto-card.html` — galeria
- `festivals/single.html` + `festivals/list.html`
- `noticies/single.html` + `noticies/list.html`
- `index.html` — secció notícies preview

**JS: `toWebP()`**
- Funció `toWebP()` a `main.js` per al hero, grid de portada i switcher de notícies
- El `data-lb-src` del lightbox continua sent JPEG

**Conversió d'imatges**
- 1066 fitxers WebP generats (235 JPEGs × 3 variants)
- Reducció estimada de pes per visita: 35-45%

**Fitxers de referència**
- Spec: `docs/superpowers/specs/2026-09-12-webp-pipeline-design.md`
- Pla: `docs/superpowers/plans/2026-09-12-webp-pipeline.md`

---

## 2026-09-12 — Manteniment: .gitignore i tracking d'hores

Sessió curta de manteniment.

- Verificat l'estat del repo i del workflow d'analytics
- Afegit `.taques/` al `.gitignore` (directori de tracking de temps, no ha d'anar al repo)

---

## 2026-09-08 — Certificat SSL Dinahosting: diagnosi i pla d'acció

Sessió de diagnosi i decisió sobre l'avís de caducitat de certificat SSL rebut de Dinahosting.

Situació analitzada: `pocallum.cat` és a GitHub Pages (cert Let's Encrypt gestionat per GitHub, automàtic). `blog.pocallum.cat` és a Dinahosting. El cert que caduca és el del hosting de Dinahosting, però el seu panel no pot validar `pocallum.cat` perquè el DNS apunta a GitHub Pages.

Decisió: sol·licitar a Dinahosting un certificat Let's Encrypt únicament per al subdomini `blog.pocallum.cat`. Redactat el correu de sol·licitud en castellà explicant la problemàtica.

`pocallum.cat` es queda a GitHub Pages. `blog.pocallum.cat` es queda a WordPress/Dinahosting per ara (eina adequada per a blog d'edició freqüent amb Yoast SEO). La migració del blog a Hugo es deixa com a projecte futur, sense urgència.

---

## 2026-09-07 — Redirect 301: URL morta amb tràfic

Correcció de 404 detectada via analytics: la URL `/en/jazz-i-am-2026-when-a-small-festival-has-more-to-say-than-a-big-one` tenia 7 visites sense pàgina de destí.

Solució: afegit `aliases` al frontmatter de `content/en/noticies/2026-03-jazz-i-am-2026.md`. Hugo genera automàticament el redirect 301 cap a la URL canònica `/en/noticies/2026-03-jazz-i-am-2026/`.

---

## 2026-07-06 — 24è Festival de Blues de Barcelona: notícia, galeria i fitxa

### Notícia nova (CA + EN)
- `content/ca/noticies/2026-07-festival-blues-barcelona.md`
- `content/en/noticies/2026-07-festival-blues-barcelona.md`

Crònica de les 3 jornades (3–5 juliol 2026): dues nits a la Seu del Districte de Nou Barris (Balta Bordoy & SirJo Cocchi, Ster Wax amb The Soulful Trio, Ubangi Stomp el divendres; Quique Gómez & His Vipers, Lluís Coloma Musical Troupe 5 i Kirk Fletcher el dissabte) i jam session de clausura al capvespre a l'Anfiteatre de Roquetes (traslladada des del Castell de Torre Baró per pesta porcina africana). Organitzador: Capibola Blues.

Imatge de portada: `static/images/noticies/festival-blues-barcelona-2026.jpg` (descarregada de blog.pocallum.cat).

### Fitxa festival actualitzada (CA + EN)
- `content/ca/festivals/festival-blues-barcelona.md`
- `content/en/festivals/festival-blues-barcelona.md`

Afegit bloc **2026 — 24è Festival** amb les 4 entrades del blog (organització/voluntaris, divendres, dissabte, jam session). Dues fotos inline afegides al cos (`bcnbluesfestival2024-01/02`). `date` i `lastmod` actualitzats a 2026-07-06.

Imatge de portada/fons actualitzada: `static/images/festivals/festival-blues-barcelona.jpg` substituïda per la nova foto de l'edició 2026.

### 13 fitxes de galeria noves
`content/ca/galeria/bcnbluesfestival2024-gal-01` a `gal-13` — fotografies individuals per artista amb dates per jornada:
- 3 jul: Balta Bordoy (×2), Santi Ursul, Ster Wax, Homero / The Soulful Trio (×2), Fede Álvarez
- 4 jul: Quique Gómez, Lluís Coloma (×2), Kirk Fletcher (×2)
- 5 jul: foto general (gal-01)

### Imatges estàtiques afegides
- `static/images/festivals/bcnbluesfestival2024-01.jpg` + `…-02.jpg`
- `static/images/galeria/bcnbluesfestival2024-gal-01` a `gal-13` (13 JPEGs)
- `static/images/noticies/festival-blues-barcelona-2026.jpg`

---

## 2026-07-03 — Guia d'espais i festivals fotogràfics: ampliació de contingut

### La Virreina Centre de la Imatge
Afegida a la secció "Espais expositius destacats" de `/noticies/guia-exposicions-espais-fotografics-barcelona/`, just després del MACBA. Espai municipal dedicat a la cultura visual i la imatge contemporània.

### 4 nous festivals a la secció de Festivals
Resultat d'una sessió de recerca activa sobre festivals a Catalunya, Balears, País Valencià i sud de França:

- **Les Rencontres d'Arles** (Arles, juliol–setembre) — el festival de fotografia més influent d'Europa. Omissió clara que ja queda coberta.
- **ValenciaPhoto** (València, juny–juliol) — 5a edició, festival de fotografia i debat amb temàtica mediterrània. Presència també a Arles.
- **PHOF – Mallorca PhotoFest** (Mallorca, abril–agost 2026) — biennal promoguda per Art Palma Contemporani, hereu del Palma Photo (2001–2015). Primera edició.
- **Raw Photo Fest Menorca** (Alaior, maig 2026) — trobada internacional de fotografia documental i de carrer organitzada per The Raw Society. Primera edició.

### Descartats (amb criteri)
- Experimental Photo Festival BCN — descartat per l'autor.
- FUJIKINA — descartat per ser un event comercial de marca.
- Certamen Villa de Andorra (Teruel) — és un concurs, no un festival; i és a Andorra de Teruel (Aragó), no el Principat.
- L'Alguer i Principat d'Andorra — cap festival fotogràfic trobat.

---

## 2026-06-24 — SEO fase 2: rendiment, schema i contingut

### M1 — `/serveis/festivals-i-sales/` CA+EN
De ~80 a 450+ paraules. Credencials des del 2002 (Blues de Barcelona, ViJazz, Nou Barris Meets New Orleans), cobertura en 5 capes, lliuraments amb volums típics (150–400 imatges), secció relació a llarg termini. Alt text descriptiu a les 24 imatges CA / 15 EN.

### C3 — Hero LCP
`<img id="js-hero-img">` sense src inicial (opacity:0). JS injecta imatge aleatòria i fa fade-in via `.is-loaded`. L'element `<img>` és candidat LCP (el `background-image` anterior no ho era). Revertit flash "imatge fixa → aleatòria" que apareixia en primera versió.

### A8 — Dates festivals 2030
6 CA + 6 EN festivals amb dates de pinning substituïdes per dates reals + `weight: 1–6`. Template `festivals/list.html` usa sort híbrid (pinned per weight, resta per date desc). Sitemap ja no mostra lastmod 2030.

### A10 — og:image fallback seccions
Pàgines de secció sense `image` explícita ara prenen la imatge de la primera pàgina filla en lloc del logo del lloc.

### M5 — LocalBusiness schema a /serveis/ i /contacte/
Schema `LocalBusiness + Photographer` condensat (NAP, areaServed, priceRange, sameAs amb Instagram + Facebook + blog) afegit a `head.html` per a totes les seccions de serveis i contacte.

### M6 — Festival schema dinàmic
Detecta disciplina (jazz, blues, flamenc, saxofon, harmònica, funk, soul, canya) → `MusicFestival`; circ, teatre, cultura comunitària, tatuatge → `Festival`.

### M8 — Bloc "Sobre l'autor" a les notícies
Bloc al peu de cada notícia: foto, nom, rol, bio ~55 paraules amb credencials verificables (2002, festivals específics). Strings a `ca.yaml` + `en.yaml`. Estils CSS `.author-bio`.

### B3/B4/B8 — Items de backlog
- B3: `sitemap: disable: true` a les 3 pàgines legals CA
- B4: Eliminat `<link rel="shortcut icon">` deprecated
- B8: Facebook afegit a `sameAs` del schema LocalBusiness de la portada

### Pendent (proper sessió)
- B7: Verificar coordenades geo a Google Maps (`41.40879, 2.19004` → Nau Bostik)
- C1: Crear i verificar Google Business Profile (acció manual, màxim impacte local)
- B5: Canal YouTube (off-site, alta correlació citació IA)
- **Notorietat off-site**: doc complet a `docs/notorietat-directoris.md` — Habitissimo, Cronoshare, Behance, ANPF, Núvol, Barcelona Activa, European Jazz Network, strategy de notes de premsa via festivals

---

## 2026-06-23 — Audit SEO complet + quick wins

### Audit
7 agents SEO especialitzats en paral·lel (Tècnic, Local, Schema, Sitemap, Performance, GEO/IA, SXO). Resultats a `docs/seo/FULL-AUDIT-REPORT.md` i `docs/seo/ACTION-PLAN.md`.

Scores: Tècnic 78/100 · Local 54/100 · GEO/IA 74/100 · SXO 61/100 · Performance ~55/100.

### Fixes aplicats

**Template / On-page**
- Capçaleres de serveis buides corregides: `.nom` → `.titol` a `index.html` i `contacte/list.html`
- `og:type` corregit per a pàgines de secció: ara emeten `website` en lloc d'`article`
- `hreflang x-default` corregit: ara apareix a totes les pàgines (CA i EN), sempre apuntant a CA
- `disableHugoGeneratorInject = true` a `hugo.toml`

**Contingut**
- `/serveis/` CA+EN: title i description amb "Barcelona" i "a Barcelona"
- Meta descriptions millorades (+ "Barcelona", + keywords) a `/contacte/`, `/festivals/`, `/galeria/`, `/noticies/` — CA i EN
- `translationKey` afegit als 10 parells de serveis CA/EN (hreflang cross-links al sitemap)

**Contingut editorial (landing pages)**
- `/serveis/concerts/` CA+EN: de ~80 a 350+ paraules — credencials, lliuraments, alt text descriptiu
- `/serveis/teatre-dansa/` CA+EN: de ~100 a 400+ paraules — companyies, espais, modalitats, lliuraments

**IA / GEO**
- RSL 1.0 afegit a `static/llms.txt`

**Performance (CLS)**
- Galeria: `.js-mosaic { opacity: 0 }` + `grid.style.opacity = '1'` post-shuffle — elimina layout shift visible
- `foto-card.html`: `width="900" height="600"` per defecte (sobreescrivible per frontmatter)
- `__heroData` inline script mogut al final del block `main` (allibera el parser HTML)

**Sitemap**
- `<changefreq>` i `<priority>` eliminats (Google els ignora des de 2023)
- Hreflang self-tag condicionat: ara no s'emet en pàgines sense traducció

### Pendent (proper sessió)
- C1: Google Business Profile (acció manual, no de codi)
- C3: Hero server-rendered (LCP -1.5–2s) — canvi de template + JS
- A8: Dates futures al sitemap (festivals amb `date: 2030`)
- A9: Testimonis de clients (requereix contingut de Joan)
- A10: `og:image` fallback dinàmic per a seccions
- M1: Ampliar `/serveis/festivals-i-sales/` CA+EN
- M5: Schema LocalBusiness a `/contacte/` i `/serveis/`
- M6: Schema festivals no musicals (`Festival` en lloc de `MusicFestival`)
- M8: Bloc "Sobre l'autor" a les notícies
- B3: Excloure pàgines legals del sitemap
- B5: Canal YouTube (off-site, correlació alta amb citació IA)
- B6: Uniformitzar dates 2002/2010 a `llms.txt`

---

## 2026-06-01

### Festival Nou Barris meets New Orleans — actualització + SEO

**Contingut**
- Nou Barris meets New Orleans: afegit vol. 5 (2024) i vol. 7 (2026) a la llista d'edicions documentades al blog
- Text actualitzat de "Sis edicions, sis volums" a "Set edicions, set volums" (CA + EN)
- Rang d'anys actualitzat a "2020 – 2026" i `date` a `2026-05-30` (CA + EN)

**SEO**
- Meta `description` afegida als 26 festivals en versió EN que no en tenien
- Schema MusicFestival: corregit `addressLocality` — ara usa el camp `city` del frontmatter o "Barcelona" per defecte en lloc del camp `lloc` complet (que és el nom del venue)

---

## 2026-05-10 (sessió 4)

### Header, menú blog i galeria portada amb animació slot machine

**Header més gran**
- `--nav-h`: 4rem → 5rem
- `.nav-link font-size`: 0.78rem → 0.95rem
- `.nav-lang font-size`: 0.75rem → 0.9rem

**Menú blog restaurat**
- Flux correcte: menú → `/blog/` (pàgina de presentació) → CTA "Visitar el blog" → `https://blog.pocallum.cat`
- Error anterior: menú apuntava directament a URL externa, saltant-se la pàgina de presentació

**Galeria de portada — layout 3×2**
- Portada: `first 6` fotos (era 8), 3 columnes a tots els viewports (mobile, tablet, desktop)
- `.foto-grid--home { grid-template-columns: repeat(3, 1fr) }` al base + overrides a 768px i 480px
- Resultat: 2 files de 3 fotos consistents a totes les mides

**Animació slot machine al shuffle**
- `@keyframes slot-spin`: la imatge entra des de dalt, rebota amunt-avall amb amplitud decreixent fins parar (9 keyframes, lineal)
- S'aplica a `.js-shuffle .foto-item img` — el contenidor queda fix (com un tambor de màquina), la imatge gira dins
- JS: delay escalonat 70ms × posició en ordre aleatori; s'aplica a l'`img`, no al contenidor
- Durada total: ~0.9s per carta, darrera carta acaba a ~1.3s
- Funciona a la galeria de portada i a la galeria completa

---

## 2026-05-09 (sessió 3)

### Pàgina de serveis — redisseny "capítols cinematogràfics" + noves seccions

**Pàgina de serveis (redisseny complet)**
- `layouts/serveis/list.html` reescrit: 5 capítols amb número `01`–`05` en taronja, títol enorme (fins 5rem), descripció del grup, llista d'ítems en dos columnes (nom + desc), foto full-width, CTA "Parlem-ne →"
- `data/serveis.yaml`: camp `image` afegit als 5 grups, paths actualitzats a `/images/services/`
- Fotos a `static/images/services/`: `instant.jpg`, `produccio.jpg`, `peper.png` (paper), `persona.jpg`, `empresa.jpg`
- Capítols alternats entre `--bg` i `--bg2` per ritme visual
- Foto oscurida per defecte (brightness 0.75), s'aclareix lleugerament al hover
- CTA final destacat: eyebrow + títol gran + botó primari taronja
- `i18n/ca.yaml` + `en.yaml`: strings `serveis_chapter_cta`, `serveis_final_pre`, `serveis_final_title`

**Secció Blog — pàgina de presentació**
- `layouts/blog/list.html` creat: page-header → estadístiques animades → presentació amb foto autor
- Estadístiques: 2.317 posts, 411.227 paraules, 93 categories, 2.939 tags, 94 comentaris
- Animació count-up: IntersectionObserver + requestAnimationFrame + easeOutCubic (1.6s)
- Foto de l'autor: `joan-blog.jpg` (blanc i negre analògic), sense crop forçat
- Menú: Blog afegit CA+EN (weight 5), Contacte bumped a weight 7
- `content/ca/blog/_index.md` + `content/en/blog/_index.md` creats

**Tira de navegació a pàgines individuals**
- Noticies single: tira horitzontal scrollable al final de l'article, ítem actual apagat
- Festivals single: tira de targetes 2:3 (format cartell), mateixa mecànica
- Ambdues: botons prev/next, scroll automàtic fins a l'ítem actual

**Nous festivals (6 nous continguts CA+EN)**
- Ramadà a Nou Barris (2023), Any Nou Xinès (2026), Jornades 9 Barris Acull (2030-order), Pícnic de Blues (2025), Carnestoltes Nou Barris (2026), ESMUC Concerts Fi de Curs (2030-order)
- Sopar d'Entitats actualitzat: 11 edicions 2015–2025 amb links al blog
- Ordre dels 9 festivals destacats: dates 2030-01-09 a 2030-01-01
- `hugo.toml`: `buildFuture = true` per mostrar festivals amb dates de 2030

**Qui som**
- Foto de l'autor afegida (retrat color): `joan-qui-som.jpg`
- Trajectòria corregida: Prollema → 2024, Lomography → "Cameras & Films"
- Links a entitats i projectes a la secció "L'arrel"

---

## 2026-05-09 (sessió 2)

### Secció Festivals — implementació completa

**Disseny "Paret de Cartells"**
- `layouts/festivals/list.html`: graella 3 columnes, sense header — el mur de cartells ocupa tot l'ample des del primer píxel
- Primer festival (hero): `grid-column: span 3`, aspect-ratio 21:9, títol fins a 7rem
- Resta: aspect-ratio 2:3 (format cartell de concert), 2 columnes
- Gap de 2px negre entre targetes — efecte galeria / press wall
- Imatge molt fosca per defecte (brightness 0.22), il·luminada al hover (0.6) + zoom 1.08x
- Títol passa de translúcid a blanc pur al hover
- Línia accent taronja que s'extén des de 0 a 4rem al hover
- Disciplina com a eyebrow amb `letter-spacing` animat

**Single de festival**
- `layouts/festivals/single.html`: hero full-viewport (100svh), nom del festival enormous (fins 10rem) al peu de la imatge
- Barra de metadades horitzontal: back link + pills de disciplina / lloc / anys / web
- Pill de disciplina en accent, pill web amb hover accent
- Prose body amb padding generós

**Contingut (10 fitxers)**
- 5 festivals CA + 5 EN: VijazZ, Blues de Barcelona, Arundo Donax, I'm Jazz, Flamenco de Barrio
- Copy amb veu punyent i directa, en primera persona, sense màrqueting
- Cadascun amb slug, disciplina, lloc, anys, web (si aplica)
- Imatges referenciades a `static/images/festivals/` (pendents d'afegir)

**Infraestructura**
- `archetypes/festivals.md` creat
- `hugo.toml`: Festivals afegit al menú CA+EN (weight 2, entre Galeria i Serveis)
- `i18n/ca.yaml` + `en.yaml`: strings `festivals_eyebrow`, `festivals_title`, `back_to_festivals`, `festival_web`
- CSS: ~170 línies noves per a festivals list + single + responsive

---

## 2026-05-09

### Secció Notícies — UI Filmin, lightbox, fidelitat de continguts i tags

**Lightbox per a galeries d'articles**
- Shortcode `{{< gallery >}}` actualitzat: cada `<figure>` porta `data-lb-src` i `data-lb-alt`
- `main.js`: handler de click que obre el lightbox existent amb navegació prev/next dins de cada galeria

**Llista Notícies — UI estil Filmin (redisseny complet)**
- `layouts/noticies/list.html` reescrit: article destacat gran a dalt + filmstrip horitzontal de miniatures a sota
- Clicar una miniatura canvia l'article destacat (transició suau 180ms)
- Botons prev/next per navegar el filmstrip
- Totes les notícies mostrades sense paginació (`.Pages.ByDate.Reverse`)
- `hugo.toml`: `pagerSize = 6` (per a altres llistats de taxonomia)

**Refinaments visuals**
- Article destacat en bloc vertical (imatge full-width, info a sota) — no costat a costat
- `padding-inline: var(--space-24)` a la zona de text (espais laterals generosos)
- `padding-bottom: var(--space-24)` per separar text del filmstrip
- `margin-bottom: var(--space-24)` al `.noticies-showcase` per separar del footer
- Efecte hover exagerat al filmstrip: `brightness(0.15)` a les no-hover (efecte grup)
- Overlay de color accent via `::after` a la miniatura activa/hover
- `transform: scale(1.1)` a la imatge en hover

**Línia del temps (CRONOLOGIA)**
- Label `CRONOLOGIA` amb línia horitzontal que s'extén (`::after`)
- Data visible a cada miniatura (`Jan '06`)
- Separadors d'any injectats per JS: text vertical en accent, línia divisòria
- Punt indicador (6px dot) a cada miniatura, gris → accent + `scale(1.5)` quan actiu

**Fidelitat de continguts vs WordPress original**
- 10 articles CA + 10 articles EN revisats i actualitzats
- Tags actualitzats per coincidir exactament amb els de WordPress (13–26 tags per article)
  - Noms d'artistes: Endless Trio, Cris Lopezz, Barencia, Joe Lovano, Makaya McCraven, etc.
  - Tècniques: tècnica zooming, velocitat lenta, efecte moviment, fotografia experimental
  - Localitzacions i festivals: Nau Bostik, Flamenco de Barrio, Jazz I Am, VijazZ
- Jazz I Am 2026: 4 vídeos Vimeo (`{{< vimeo-embed >}}`) afegits en posició correcta (CA + EN)
- Ciutat Flamenco Barcelona: imatge inline + 6 links a blog.pocallum.cat afegits (CA + EN)
- Imatge `festival-general.jpg` descarregada de WordPress i afegida a `static/images/noticies/`

**i18n**
- `ca.yaml` + `en.yaml`: strings `timeline_label`, `pagination_label`, `pagination_prev`, `pagination_next`, `read_article`

---

## 2026-05-05

### Construït des de zero (migració WordPress → Hugo)

**Sessió inaugural.** Creació completa del projecte Hugo a partir de zero, basant-se en l'estètica de malditasmaquinas.com.

**Infraestructura**
- Repositori GitHub creat: `112books/pocallum.cat`
- GitHub Actions: deploy staging (develop → staticrypt) i producció (main → GitHub Pages)
- Fitxer `CNAME` per al domini `pocallum.cat`
- Script interactiu `sync-pocallum.sh` per a gestió del projecte

**Tema custom `themes/pocallum/`**
- CSS vanilla amb custom properties, sense cap framework
- Tipografies: Chicago FLF (logo), Syne variable (títols), Inter (cos), IBM Plex Sans Condensed (labels)
- Color accent taronja `#FF5500` afegit (logo dot, CTA, botons primaris)
- Galeria mosaic: grid 6 columnes, mides aleatòries per càrrega (tall, wide, big, hero) amb Fisher-Yates shuffle
- Lightbox natiu amb navegació per teclat
- Nav mòbil amb aria-expanded
- Logo làmpara al header (`mix-blend-mode: screen`)

**Contingut**
- 152 fotografies de galeria migrades de WordPress
- Dates corregides: 105/152 fotos amb data real (EXIF + nom de fitxer)
- Contingut multilingüe CA (defecte) + EN, ES preparat

**Disseny aprovat (pendent d'implementar)**
- Secció Festivals: content type propi, pàgines individuals, menú principal
- Copy serveis reescrit: veu punyent i directa
- Formulari pressupost wizard 4 passos (Tally.so)
- Spec: `docs/superpowers/specs/2026-05-05-festivals-serveis-formulari-design.md`

---
