# Migració de pocallum.cat a Dinahosting

> Document operatiu per executar la migració amb una IA (Claude/opencode/ChatGPT) o manualment.
> Es requereix **llegir el CLAUDE.md** del projecte abans d'executar res.
> **No executar cap fase sense el vistiplau explícit de l'usuari**, especialment les que toquen DNS, SSL, GitHub Settings o el servidor.

- **Data del pla:** 2026-09-16
- **Termini crític:** el certificat de `blog.pocallum.cat` caduca el **2026-09-22**. S'ha de completar la migració (fins a SSL) abans d'aquesta data, o el blog quedarà sense HTTPS vàlid.
- **Autor del pla:** sessió amb l'usuari (Joan), repo `blog.pocallum.cat` → document originat aquí, còpia de referència allà.

---

## Objectiu

Moure `pocallum.cat` (el lloc pare) de GitHub Pages a **Dinahosting**, deixant-hi els dos sites Hugo independents:

```
Dinahosting · vl28359.dinaserver.com · 82.98.166.123 (SSH user: pocallum)
~/www/
├── pocallum/          ← pocallum.cat (pare, NOU)
└── blog/              ← blog.pocallum.cat (JA EXISTEIX)
    └── wp-content/    ← imatges WordPress (INTOCABLES)
```

- **L'staging del pare es manté a GitHub Pages** (branca `develop` + staticrypt) — model Opció B de l'staging del blog. Sols `pocallum.cat` va a Dinahosting.

- **Git queda només per control de versions** i testing local previ (`hugo server -D`). Ni GH Pages ni cap deploy via GitHub.
- **SSL simplificat:** amb tot el DNS apuntant a Dinahosting, Let's Encrypt es valida i renova directament al panell.
- **CMS (fase final):** Sveltia CMS per `pocallum.cat`, `https://pocallum.cat/admin/`.

---

## Estat actual (referència)

### Pare (`pocallum.cat`) — repo `112books/pocallum.cat`

| Entorn | Branca | URL | Deploy |
|--------|--------|-----|--------|
| Producció | `main` | `https://pocallum.cat/` | GitHub Pages (`deploy-prod.yml`, actions/configure-pages) |
| Staging | `develop` | `https://112books.github.io/pocallum.cat/` (staticrypt, pwd `LinuxBCN2026`) | `gh-pages-staging` (`deploy-staging.yml`) |
| Local | — | `localhost:1313` | `hugo server -D` |

- **Hugo v0.159.0 extended** · `hugo --minify --baseURL "https://pocallum.cat/"` + **Pagefind** (només prod).
- **Multilingüe:** `ca` (default), `en` actives; `es` desactivada.
- **`static/` ~248 MB:** images (~237 MB), fonts (~11 MB), `admin/` (GoatCounter dashboard), `CNAME`, `_headers`, robots/humans/llms.txt.
- **`static/CNAME` = `pocallum.cat`** → s'ha d'eliminar al final.
- **`static/_headers`:** headers de seguretat de GH Pages → **s'han de convertir a `.htaccess`** per Apache.
- DNS actual: `pocallum.cat` → 185.199.108.153 / .109.153 / .110.153 / .111.153 (GitHub Pages).
- Workflows que els manté: `deploy-prod.yml`, `deploy-staging.yml`, `fetch-analytics.yml`, `update-blog-stats.yml`.
- Script local: `sync-pocallum.sh` (menú interactiu).

### Blog (`blog.pocallum.cat`) — repo `112books/blog.pocallum.cat`

- Producció ja a Dinahosting: `~/www/blog/` via rsync (`deploy-produccio.yml`, push a `develop`). **Model a replicar al pare.**
- Staging encara a GitHub Pages → **decisió oberta** (vegeu § Decisions pendents).
- El workflow de referència usa: `rsync -rlzv --delete --exclude='wp-content/' --exclude='.well-known/' --no-perms public/ pocallum@$HOST:$PATH/`.
- Secrets del blog: `SSH_PRIVATE_KEY_DINAHOSTING`, `DINAHOSTING_HOST`, `DINAHOSTING_USER`, `DINAHOSTING_PATH`.

---

## Regles d'or (obligatòries)

1. **No tocar mai `wp-content/`** (imatges del blog). Excloure dels rsync i del `--delete`.
2. **Redirect HTTP→HTTPS NO es fa mai via `.htaccess`** (loop infinit pel proxy de Dinahosting). Es configura al panell/proxy.
3. **Ordre:** build a Dinahosting verificat → DNS → SSL → verificació → **els últims**, neteges de GitHub Pages.
4. **Mantenir el custom domain configurat a GitHub Pages fins que el DNS+SSL a Dinahosting estiguin verificats** (rollback = 1 canvi de DNS).
5. **Cap acció sobre el servidor, DNS o panells sense vistiplau explícit de l'usuari.**
6. **Backup:** abans de tocar res del servidor, comprovar els backups existents del blog (wp-content, BD) segons el pla del CLAUDE.md del blog.

---

## Fases

### Fase 1 — Preparar el repo pare (local, sense risc)

1. **Secrets** (GitHub → `112books/pocallum.cat` → Settings → Secrets → Actions): afegir els mateixos 4 que el blog:
   - `SSH_PRIVATE_KEY_DINAHOSTING` (ed25519)
   - `DINAHOSTING_HOST` = `vl28359.dinaserver.com`
   - `DINAHOSTING_USER` = `pocallum`
   - `DINAHOSTING_PATH` = `~/www/pocallum`
2. **`.htaccess` nou** a `static/` (convertir `_headers`):
   - `ErrorDocument 404 /404.html`
   - `Header set` HSTS, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`
   - Conservar `Content-Security-Policy` del `_headers` (self + `gc.zgo.at`, `*.goatcounter.com`, Tally.so frames)
   - Comentari explícit: **no posar redirect HTTP→HTTPS aquí**
3. **Convertir `static/_headers`** → es queda com a documentació per GH Pages (staging mentre visqui) però no s'usa a Dina. (O eliminar al final.)
4. **Adaptar `sync-pocallum.sh`:** substituir els deploys de GH Pages per rsync a Dinahosting (model de `sync-blog.sh`):
   - prod → `rsync -rlzv --delete --no-perms public/ pocallum@vl28359.dinaserver.com:/home/pocallum/www/pocallum/`
   - staging → es manté a GitHub Pages (sense rsync)
   - mantindre `server_local`, `build_local`, `nova_foto`, `nova_noticia`, i el `deploy_staging` de GH Pages
5. **Verificar build local:** `hugo --minify` sense errors.

### Fase 2 — Workflows del repo pare

1. **`deploy-prod.yml`** → substituir el deploy a GH Pages per rsync (cal copiar l'estructura del blog):
   - build Hugo v0.159 extended + Pagefind (`npx pagefind --site public`)
   - rsync `--delete --no-perms` a `$DINAHOSTING_PATH/` usant els secrets
   - exclusions: `.well-known/` (per si la validació ACME del panell usa http-01)
   - trigger: push a `main` + `workflow_dispatch`
   - treure `actions/configure-pages`, `upload-pages-artifact`, `deploy-pages` i els permisos `pages: write`, `id-token: write`
2. **`deploy-staging.yml`** → **SENSE CANVIS.** L'staging del pare es queda a GitHub Pages (staticrypt + `gh-pages-staging`), com l'staging del blog (Opció B). Els secrets i el workflow actuals es mantenen.
3. **`fetch-analytics.yml` i `update-blog-stats.yml`:** sense canvis (comitten al repo, no despleguen).

### Fase 3 — Servidor Dinahosting (requereix vistiplau)

1. **SSH al servidor:** `ssh -i ~/.ssh/pocallum_blog pocallum@vl28359.dinaserver.com` (o via panell).
2. **Crear docroot:**
   ```bash
   mkdir -p ~/www/pocallum
   ```
3. **Donar d'alta el lloc al panell de Dinahosting** (feina de l'usuari o amb suport):
   - `pocallum.cat` → docroot `~/www/pocallum/`
   - *(l'staging es queda a GitHub Pages, sense vhost ni docroot a Dinahosting)*
4. **Protegir staging:** no aplica (l'staging es queda a GitHub Pages amb staticrypt).
5. **Primer rsync manual del build** (des del repo pare, local):
   ```bash
   hugo --minify --baseURL "https://pocallum.cat/" && rsync -rlvz --delete --no-perms public/ pocallum@vl28359.dinaserver.com:/home/pocallum/www/pocallum/
   ```
6. **Test sense DNS** (des de la màquina local):
   ```bash
   curl --resolve pocallum.cat:443:82.98.166.123 -k -s -o /dev/null -w "%{http_code}" https://pocallum.cat/
   # esperat: 200 (amb -k perquè encara no hi ha cert vàlid per aquest nom)
   ```

### Fase 4 — DNS (feina de l'usuari, al registrador de pocallum.cat)

- Apuntar a `82.98.166.123`:
  - `pocallum.cat` (A)
  - `www.pocallum.cat` (A)
  - *(no hi ha `staging.pocallum.cat` a Dinahosting: l'staging es queda a GitHub Pages)*
- `blog.pocallum.cat` ja hi apunta: no tocar.
- **Propagació 15-30 min.** Fer-ho de matí amb marge.
- Rollback immediat: tornar els registres als 185.199.x.x de GitHub Pages.

### Fase 5 — SSL/HTTPS (panell Dinahosting, amb suport si cal)

1. **Activar Let's Encrypt per `pocallum.cat`** (+ `www.pocallum.cat`) al panell. Ara la validació funcionarà perquè el DNS ja apunta a Dinahosting.
2. **Renovar/activar el de `blog.pocallum.cat`** (caduca 22/09) — fer-ho a la mateixa sessió.
3. **Activar el redirect HTTP→HTTPS al proxy/panell** (Forçar HTTPS) per als dos dominis. **NO al `.htaccess`.**
4. **Verificar:**
   - `curl -I https://pocallum.cat/` → 200, cert vàlid (issuer Let's Encrypt), no caducat
   - `curl -I http://pocallum.cat/` → 301 cap a `https://`
   - `curl -I https://blog.pocallum.cat/` → 200 + cert vàlid
   - `curl -I http://blog.pocallum.cat/` → 301

### Fase 6 — Verificació completa

- **Pare (QA 1:1):** home, galeria, festivals, notícies, serveis, qui-som, contacte, cerca (Pagefind), 404 (ErrorDocument), web fonts (Syne/Inter/IBM Plex), imatges de `static/images/`, `robots.txt`, `sitemap.xml` → tot 200 sobre `https://pocallum.cat/`.
- **Formulari de contacte** (`/contacte/`): testejar enviament contra l'endpoint propi (`/formulari.php`).
- **GoatCounter:** `/admin/` carrega i l'estadística s'hi veu; `gc.zgo.at` al CSP no bloquejada.
- **Blog:** re-crawlar el sitemap (`scripts/qa-urls.py` del blog contra `https://blog.pocallum.cat/`) → 200 a totes les URLs.
- **Staging:** `https://112books.github.io/pocallum.cat/` demana contrasenya (staticrypt) i mostra el site amb drafts.
- **Bilingüe:** `/en/` respon igual que `/ca/`.

### Fase 7 — Neteges GitHub (NOMÉS després de la verificació completa)

1. GitHub → `112books/pocallum.cat` → Settings → Pages → **treure el custom domain** `pocallum.cat`.
2. Si `gh-pages-staging` ja no cal: esborrar la branca.
3. Treure (o comentar) `static/CNAME` i netejar `static/_headers` si no es fa servir més.
4. Marquar que `deploy-prod.yml` ja no fa servir components de Pages (l'staging sí, es manté).
5. Actualitzar `CLAUDE.md` i `AGENTS.md` del pare (eliminar "GitHub Pages" de l'arquitectura).

### Fase 8 — CMS (final, decidida per l'usuari)

- Sveltia CMS per `pocallum.cat`: `static/admin/index.html` + `config.yml` (repo, branca `main`), OAuth GitHub (`OAUTH_CLIENT_ID`/`OAUTH_CLIENT_SECRET`), URL `https://pocallum.cat/admin/`.
- Media uploads a `static/media/` (commitat al repo). Deploy automàtic a Dinahosting en push.
- Replicar el model ja documentat al CLAUDE.md del blog (§ Pla CMS).

---

## Decisions pendents (abans d'executar)

1. **Staging del blog:** ✔ **Decidit (16/09):** Opció B — es queda a GitHub Pages; les imatges hotlinken de producció i és la xarxa de seguretat. Unificar-lo en una fase dedicada més endavant.
2. **Staging del pare:** ✔ **Decidit (16/09):** es queda a GitHub Pages (mateix model que l'staging del blog). Sense `staging.pocallum.cat` a Dinahosting.
3. **Docroot:** confirmat `~/www/pocallum/`.
4. **Accés de l'usuari (necessari abans de Fase 4-5):** panell DNS del registrador de `pocallum.cat`, panell de Dinahosting, GitHub Settings del repo pare.

---

## Feina de l'usuari (imprescindible per les fases 4-5)

| Què | On |
|-----|-----|
| Canviar registres A de `pocallum.cat` i `www` | panell DNS del registrador |
| Activar Let's Encrypt + Forçar HTTPS | panell de Dinahosting (o suport) |
| Donar d'alta el lloc `pocallum.cat` al panell | panell de Dinahosting |
| Secrets al GitHub del repo pare (Fase 1) | GitHub Settings |

---

## Rollback

- **Abans de la Fase 7 (neteges):** tornar els registres A de `pocallum.cat` als 185.199.x.x (GitHub Pages). El custom domain encara és configurat a GitHub → el lloc torna a servir en minuts. No cal tocar `blog.pocallum.cat`.
- **Després de la Fase 7:** requereix re-configurar el custom domain a GitHub Pages i re-pujar el CNAME — més costós, per això la Fase 7 és l'última.

---

## Pendents post-migració (anotat 16/09)

1. **Revisió final de QA (Fase 6 complets):** repassar que tot rutlli a producció (galeria, festivals, notícies, serveis, qui-som, contacte, cerca, bilingüe, blog, GoatCounter, 404, web fonts, imatges, robots.txt, sitemap) i tancar els punts pendents de la Fase 5 (cert del blog, caduca 22/09).
2. **Formularis amb SMTP propi:** ✅ **Implementat (17/09/2026)** — vegeu la secció "Formulari de contacte (leads)" més avall. El contacte ja no depèn de cap tercer: envia des de l'endpoint propi de Dinahosting i registra els leads al servidor.
3. **Avaluar esborrar les imatges no usades (2.3G a `~/arxiu-imatges/`):** abans d'esborrar res s'ha de comprovar que (a) cap altre lloc les referenciï (CSS, feeds, sitemap, el site pare), i (b) les originals estiguin garantides a Google Fotos/Vimeo (el material fotogràfic no viu només a les carpetes del servidor). És una decisió de l'usuari amb verificació prèvia.

---

## Formulari de contacte (leads) — implementat 17/09/2026

El wizard natiu de `/contacte/` ja no envia a Formspree: ho fa a un **endpoint propi** `https://pocallum.cat/formulari.php`, allotjat a Dinahosting. Cap dada no surt del servidor — els leads es registren en Markdown a `~/leads/` i es notifica per mail a `hola@pocallum.cat`.

### Endpoint
- Fitxer: `static/formulari.php` → rsync el desplega a `~/www/formulari.php`.
- Contracte: resposta JSON `{"ok": true|false}`. El wizard fa `fetch()` amb `Accept: application/json`; davant d'un error no-2xx/JSON mal format mostra el missatge d'error del detall de contacte directe.
- Entrada (POST):
  - camps visibles del wizard (`nom`, `email`, `telefon`, `servei`, `projecte`, `quan`, `lloc`, `via`)
  - `_subject`, `_language`, `_consent` (checkbox de privacitat, ha de ser `1`)
  - camp ocult `_ts` (epoch ms, emplenat per JS en carregar el wizard)
  - camp honeypot `_gotcha` (ha d'arribar buit)

### Filtre anti-spam (capes)
1. `_gotcha` omplert → 200 `{ok:true}` silenciós sense registrar.
2. `_ts` massa recent (<4 s) → rebutjat (bots) / massa gran (tamper).
3. Rate-limit per IP: màx. 5 enviaments/60 min. Fa servir fitxers md5 a `~/leads/.control/` (mode 770, grup `pocallumgrp` — www-data hi escriu). Superat → 429.
4. Validesa de email; blocatge de dominis temporals (`$DISPOSABLE`); heurística de massa URLs.
5. Límits de longitud per camp.

### Registre (RGPD)
- Líder fitxer: `~/leads/YYYY-MM/YYYY-MM-DD-HHMMSS-nom-slug.md` (frontmatter: `id`, `data`, `estat: nou`, `consentiment: si`, `email`, `nom`, `servei`, `via`, `idioma`).
- **Consentiment requerit** — sense `_consent=1` el servidor retorna **422** i no registra res.
- **Retenció: 24 mesos** des de la data del lead. Passat el termini s'ha d'eliminar (documentat a les polítiques legals).
- Finalitat: només contacte directe per fer un pressupost. Ni newsletter, ni cessió a tercers (documentat a `privacitat.md`).

### Cache del proxy Dinahosting (⚠️)
El proxy de Dinahosting cacheja respostes POST de la mateixa URL. Per això `formulari.php` i el `.htaccess` fan servir:
- `Header set Cache-Control "no-store, no-cache, must-revalidate, max-age=0"` (dins `<FilesMatch "formulari\.php$">`)
- `Header set Pragma "no-cache"`

Mantenir aquests headers al `.htaccess` — si es treuen, les proves tornen a servir respostes cachejades (falsos `{ok:true}` sense registrar).

### Error log
Problemes de `.htaccess`/500 es veuen a `~/logs/apache.error.log` del servidor. El 17/09: un `</IfModule>` sobrant al `.htaccess` va donar 500 a totes les peticions `formulari.php` — l'error portava `<IfModule> without matching`.

---

## Fora d'abast

- `about.pocallum.cat` (site extern del mateix usuari) — no es toca.
- El contingut del blog i les imatges de `wp-content/`.
- Els serveis tercers que ja funcionen (GoatCounter) — només verificació.
- Migrar l'staging del blog (decisió pendent, Opció B de moment).