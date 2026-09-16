# CLAUDE.md — pocallum.cat

> Guia operativa per a Claude Code en aquest projecte.

## Projecte

Web oficial de **Pocallum**, servei fotogràfic cultural de Joan Linux Martínez. Especialitzat en jazz, blues, música, teatre, dansa i arts escèniques. Construït amb Hugo (static site generator), tema custom i continguts en Markdown.

Migrat de WordPress a Hugo. Migració completada a producció (16/09/2026): el web viu a **Dinahosting**, no a GitHub Pages.

- **Producció:** `https://pocallum.cat` → Dinahosting (servidor `vl28359.dinaserver.com`, docroot `~/www`). Deploy per GitHub Action (`deploy-prod.yml`) amb rsync des de la branca `main`.
- **Staging:** GitHub Pages protegit amb staticrypt (branca `develop`), password: `LinuxBCN2026` — per testejos i com a backup del desplegament.
- **Local:** `hugo server -D` → `http://localhost:1313` (una instància per cada màquina on es treballa)
- **DNS:** gestionat des de Dinahosting (registres A → `82.98.166.123`). Server marca **Forçar HTTPS** activat al panell.
- **Blog personal (a Dinahosting, no tocar):** `https://blog.pocallum.cat` — vhost propi a `~/www/blog/`, *orgullosament* Hugo estàtic (ja no WordPress). Exclòs del rsync.
- **Biografia (extern, no tocar):** `https://about.pocallum.cat`

---

## Stack tècnic

| Capa | Tecnologia |
|------|-----------|
| SSG | Hugo v0.159+ extended |
| Tema | Custom `themes/pocallum/` |
| CSS | Vanilla CSS amb custom properties (cap framework) |
| JS | Vanilla JS mínim (galeria mosaic + shuffle + lightbox) |
| Idiomes | CA (per defecte), EN, ES (preparat, no activat) |
| Formulari | Wizard natiu 4 passos → Formspree (`formspreeContact`) |
| Analytics | GoatCounter (sense cookies, GDPR) |
| DNS/Domini | Dinahosting |

**Fonts (totes autoallotjades a `static/fonts/`):**
- `Chicago FLF` → logo/wordmark
- `Syne` (variable, 400–800) → títols display
- `Inter` (400/500) → cos del text
- `IBM Plex Sans Condensed` (regular/bold) → labels, dates, detalls

---

## Entorns

### Local
```bash
hugo server -D              # amb drafts
hugo server -D --port 1314  # port alternatiu
```

### Staging (branca develop)
```bash
git checkout develop
git push origin develop     # activa GitHub Action → GitHub Pages + staticrypt
```

### Producció (branca main)
```bash
git checkout main
git merge develop
git push origin main        # activa GitHub Action → rsync a Dinahosting (~/www)
```

> El workflow de producció (`.github/workflows/deploy-prod.yml`) fa build Hugo + Pagefind i sincronitza `public/` a `~/www` amb rsync (`--delete`), **excloent** `blog/`, `.well-known/` i `cgi-bin/` (vhost i sistema del compte). No canvia permisos (SSH restringit). Document de referència: `MIGRACIO-DINAHOSTING.md`.

---

## Estructura de directoris

```
pocallum.cat/
├── .github/workflows/         # CI/CD GitHub Actions
├── themes/pocallum/           # tema custom
│   ├── assets/css/main.css    # tots els estils
│   ├── assets/js/main.js      # shuffle mosaic + lightbox
│   └── layouts/               # templates Hugo
│       ├── _default/          # baseof, list, single
│       ├── index.html         # portada
│       ├── galeria/           # galeria mosaic aleatòria
│       ├── festivals/         # llistat + pàgines individuals de festival
│       ├── noticies/          # llistat + single articles
│       └── partials/          # head, header, footer, foto-card
├── content/
│   ├── ca/                    # contingut català (per defecte)
│   │   ├── galeria/           # 152 fotografies
│   │   ├── festivals/         # festivals on hem treballat
│   │   └── noticies/          # notícies
│   └── en/                    # contingut anglès
├── data/
│   └── serveis.yaml           # serveis fotogràfics (no pàgines)
├── i18n/
│   ├── ca.yaml                # strings UI català
│   ├── en.yaml                # strings UI anglès
│   └── es.yaml                # preparat, mínim
├── static/
│   ├── fonts/                 # woff2 autoallotjades
│   ├── images/
│   │   ├── galeria/           # 152 JPEGs
│   │   ├── festivals/         # fotos destacades per festival
│   │   ├── noticies/          # fotos de notícies
│   │   └── logotip/           # logo làmpara PNG
├── archetypes/                # plantilles hugo new
├── docs/superpowers/specs/    # design docs aprovats
├── HISTORY.md                 # registre de sessions
└── hugo.toml                  # configuració principal
```

---

## Idiomes

- **CA** (català) — idioma per defecte, `defaultContentLanguage = "ca"`
- **EN** (anglès) — secundari, `contentDir = "content/en"`
- **ES** (castellà) — preparat però **no activat**: `es.yaml` mínim, sense contingut, no apareix al selector

Per activar el castellà quan toqui: afegir contingut a `content/es/`, omplir `es.yaml`, i afegir `languages.es` al menú de `hugo.toml`.

### ⚠️ Regla de traducció obligatòria

**Tot contingut nou (festivals, notícies, pàgines) s'ha de crear en CA i EN simultàniament.**

- Festival CA → `content/ca/festivals/slug.md` + `content/en/festivals/slug.md`
- Notícia CA → `content/ca/noticies/slug.md` + `content/en/noticies/slug.md`
- El castellà no cal fins que s'activi l'idioma.

---

## Tipus de contingut

### Fotografia de galeria (`content/ca/galeria/`)
```yaml
---
title: "Títol opcional"
date: 2026-01-01
servei: "cultura"    # cultura | artistes | empreses
image: "/images/galeria/nom-fitxer.jpg"
draft: false
---
```

### Festival (`content/ca/festivals/`)
```yaml
---
title: "Nom del Festival"
date: 2025-01-01        # data darrer any treballat (per ordenació)
anys: "2019 – 2025"     # rang visible
lloc: "Barcelona"
disciplina: "Jazz"
web: "https://..."      # opcional
image: "/images/festivals/slug.jpg"
draft: false
---
```

### Notícia (`content/ca/noticies/`)
```yaml
---
title: "Títol de la notícia"
date: 2026-01-01
lead: "Resum curt, màxim 160 caràcters."
image: "/images/noticies/nom-fitxer.jpg"
tags: ["tag1", "tag2"]
pinned: true   # opcional — veure "Notícia fixada" més avall
draft: false
---
```

Imatges addicionals al cos (galeria d'una crònica): carpeta `static/images/noticies/{slug}/` + `![](/images/noticies/{slug}/nom.jpg)` al Markdown. **Els noms de fitxer no poden portar espais** — trenca la sintaxi `![]()` i la imatge no renderitza. Usar guions.

#### Notícia fixada (pinned)
`pinned: true` al frontmatter (CA **i** EN) fa que una notícia surti sempre primera — tant a `/noticies/` com al bloc de notícies de la portada — independentment de la data. Lògica a `themes/pocallum/layouts/noticies/list.html` i `themes/pocallum/layouts/index.html` (`where ... "Params.pinned" true` + `append` per anteposar-les a la resta ordenada per data). Actualment pinnada: "Guia d'exposicions i espais fotogràfics a Barcelona".

### Pàgines estàtiques
`serveis/`, `qui-som/`, `contacte/` → `_index.md` amb contingut Markdown.

---

## Serveis (data/serveis.yaml)

Tres grups. No creen pàgines individuals, es renderitzen a `/serveis/`.

**Cultura:** concerts i events, grups musicals, arts escèniques (teatre, dansa)
**Artistes:** books actorals, books artístics, perfil professional
**Empreses:** fotografia de personal i instal·lacions, fotografies per a xarxes socials

**No s'ofereix:** formació (→ Llumàtics), fotografia de producte, fotografia gastronòmica.

---

## Testimonis (data/testimonis.yaml)

Surten a `/contacte/` (sota "O escriu-nos directament") i `/qui-som/` (sota el bloc autor), CA i EN. Render via `partials/testimonis.html`, filtra per `publicat: true`.

**Afegir-ne un de nou:**
1. Obtenir permís explícit de la persona abans de publicar cap cita (encara que vingui d'un WhatsApp o mail informal).
2. Afegir entrada a `data/testimonis.yaml`:
   ```yaml
   - nom: "Nom Cognom"
     entitat: "Organització (opcional)"
     publicat: true
     cita_ca: "Text en català."
     cita_en: "English translation."
   ```
3. `hugo --minify` per verificar build, commit, push.

**Deixar-ne un en espera** (pendent de confirmació o de rebre el text): `publicat: false`, camps `cita_ca`/`cita_en` buits. No surt enlloc fins que es completi i es passi a `true`.

⚠️ Mai publicar una cita sense permís explícit, encara que la font sigui pública (missatge privat, xarxa social, etc.).

---

## Sistema visual

### Paleta
```css
--bg:     #080808   /* fons principal */
--bg2:    #111111   /* fons seccions alternes */
--fg:     #f0f0f0   /* text principal */
--mid:    #777777   /* text secundari */
--line:   #1c1c1c   /* separadors */
--accent: #FF5500   /* taronja — CTA, logo dot, botons primaris */
```

### Principis de disseny
- Negre profund + blanc pur + taronja d'accent
- Tipografia **molt gran** com a element de disseny (títols 4–6rem)
- La imatge mana — layouts que donin espai a les fotos
- Estètica jazz: minimalisme editorial, no decoració
- Referència visual: `malditasmaquinas.com` (mateix autor)

---

## Galeria — comportament especial

La galeria (`/galeria/`) combina **shuffle** + **mosaic de mides variables**. Cada càrrega genera un layout únic.

- Grid: 6 columnes, `grid-auto-flow: dense`, files de 260px
- Mides (assignació aleatòria ponderada per JS): estàndard (50%), tall (22%), wide (14%), big (10%), hero (4%)
- Classes CSS: `.foto-item--tall`, `.foto-item--wide`, `.foto-item--big`, `.foto-item--hero`
- El grid de la galeria porta la classe `js-shuffle js-mosaic`
- El grid de portada porta `js-shuffle` (sense `js-mosaic` → sense mides variables)

A la portada, les darreres 8 fotografies s'mostren en ordre cronològic invers (sense mosaic).

---

## To i veu

- **Idioma principal:** català
- **To:** proper, directe, punyent — ni corporatiu ni servil
- **Personalitat:** artista i professional, no proveïdor de serveis estàndard
- **Evitar:** màrqueting genèric, superlatifs buits, frases fetes del sector, castellanismes
- **Exemple de veu:** "Hi ha fotògrafs que fan fotos de grups. I hi ha fotògrafs que entenen la música."
- **Exemple CTA:** "Cada projecte és diferent. Explica'ns el teu i et fem un pressupost a mida, sense embuts."

---

## Dashboard d'estadístiques (`/stats/`)

Dashboard custom integrat al lloc, amb l'estètica de pocallum (colors, Syne, IBM Plex, tema fosc). **Mai canviar el link del footer a una URL externa** — sempre apunta a `/stats/`.

### Arquitectura
- `static/stats/index.html` — dashboard HTML (autocontingut, protegit per contrasenya SHA-256)
- `static/stats/analytics.json` — dades generades automàticament cada hora per GitHub Actions
- `scripts/build-analytics-json.py` + `scripts/process-analytics.py` — scripts que criden l'API de GoatCounter
- `.github/workflows/fetch-analytics.yml` — workflow que s'executa cada hora (`cron: '0 * * * *'`)

### Secret requerit a GitHub
El workflow necessita el secret `GOATCOUNTER_TOKEN` al repo (Settings → Secrets and variables → Actions).
Per generar-lo: `pocallum.goatcounter.com` → Settings → API tokens → New token → Read stats ✓

**⚠️ L'email del compte GoatCounter cal estar verificat** — sense verificació, l'API retorna 401 encara que el token sembli correcte. El mail de verificació sol anar a l'spam.

**Si `analytics.json` té zeros**, el secret falta o és invàlid. Solució: regenerar el token a GoatCounter i afegir-lo a GitHub Secrets, després llançar manualment el workflow (Actions → Fetch GoatCounter Analytics → Run workflow).

### Contrasenya del dashboard
Hash SHA-256 configurat a `static/stats/index.html` → variable `pwHash`. Per canviar la contrasenya:
```bash
echo -n "nova_contrasenya" | shasum -a 256
```

### Repositori de referència
`../goatcounter-dashboard` — repositori independent amb el codi font del dashboard i instruccions d'instal·lació.

---

## Comandes útils

```bash
# Nou festival
hugo new festivals/nom-festival.md

# Nou article de notícies
hugo new noticies/2026-01-titol.md

# Nova fotografia de galeria
hugo new galeria/2026-01-nom-foto.md

# Build de producció (minificat)
hugo --minify

# Deploy complet (menú interactiu)
./sync-pocallum.sh

# Convertir una foto nova a WebP (cal fer-ho ABANS de commitear)
./scripts/convert-images.sh static/images/galeria/nova-foto.jpg
# (també funciona amb festivals/ i noticies/)
```

---

## Pendent d'implementar

- **Dashboard d'estadístiques (GoatCounter)** — implementat a `static/stats/` → `https://pocallum.cat/stats/` (documentat a la secció "Dashboard d'estadístiques").
- **CMS d'edició (Sveltia CMS)** — implementat a `static/admin/` → `https://pocallum.cat/admin/`. Login amb **PAT** de GitHub (no cal OAuth App). Backend: repo `112books/pocallum.cat`, branca `main`. La CSP global del site no s'aplica aquí (`.htaccess` propi dins `static/admin/` que n'amplia els permisos). Veure `MIGRACIO-DINAHOSTING.md` → Fase 8.
- **Tasca pendent de notícies** — redactar notícia dels festivals *MASiMAS Balkan Reunion* i *Recordant el Paral·lel* (veure `HISTORY.md` → secció PENDENT, 16/09/2026). Patró: `content/ca/noticies/` + versió EN.
- **Formulari amb SMTP propi** — substituir Formspree per l'enviament via SMTP del compte Dinahosting (veure `MIGRACIO-DINAHOSTING.md`).
- **Imatges no usades** — avaluar esborrar `~/arxiu-imatges` (~2.3 GB) al servidor, un cop confirmat que res no les referència (veure `MIGRACIO-DINAHOSTING.md`).

Spec complet: `docs/superpowers/specs/2026-05-05-festivals-serveis-formulari-design.md`

---

## Fora d'abast (no tocar en aquesta fase)

- Newsletter / mailing list
- Botiga o e-commerce amb mercandatge propi
- Castellà activat
- Blog integrat (`blog.pocallum.cat` és independent, viu a Dinahosting) <--- compte amb el rsync: exclou `blog/`!
- Formació fotogràfica (→ Llumàtics)

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).


---

## Control horari

Skill actiu: `gestor-hores` — registra automàticament el temps de treball per sessió.

- Logs a `.taques/pocallum.cat/YYYY-MM-DD.md` (creat automàticament)
- Comandes: `/time-log [tasca] [hores]`, `/time-report [periode]`, `/time-config [hores] [tarifa]`
- No modificar manualment els fitxers `.taques/` — són append-only
