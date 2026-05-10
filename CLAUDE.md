# CLAUDE.md — pocallum.cat

> Guia operativa per a Claude Code en aquest projecte.

## Projecte

Web oficial de **Pocallum**, servei fotogràfic cultural de Joan Linux Martínez. Especialitzat en jazz, blues, música, teatre, dansa i arts escèniques. Construït amb Hugo (static site generator), tema custom i continguts en Markdown.

Migrat de WordPress a Hugo. El WordPress roman actiu fins al tall final del domini.

- **Producció:** `https://pocallum.cat` → GitHub Pages (main)
- **Staging:** GitHub Pages protegit amb staticrypt (branca `develop`), password: `LinuxBCN2026`
- **Local:** `hugo server -D` → `http://localhost:1313`
- **Blog personal (extern, no tocar):** `https://blog.pocallum.cat`
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
| Formulari | Tally.so (embed iframe, wizard 4 passos) |
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
git push origin main        # activa GitHub Action → GitHub Pages
```

### ⚠️ Ordre obligatori en canvis de domini (lliçó apresa)

El workflow usa `actions/configure-pages` que llegeix el custom domain de GitHub Settings **en el moment de la build**. Si el DNS canvia abans que el custom domain estigui configurat a GitHub, la build es fa amb la URL de github.io i el CSS/imatges no carreguen.

**Ordre correcte per a migracions de domini:**
1. GitHub → Settings → Pages → Custom domain → escriu el domini → Save
2. Verifica que el CNAME file existeix a `static/CNAME`
3. Fes un push a main i comprova que el workflow acaba correctament
4. Comprova que el HTML generat té paths correctes (no `/repositori/css/...`)
5. *Llavors* canvia els DNS a Dinahosting

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
draft: false
---
```

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

## Dashboard d'estadístiques (`/admin/`)

Dashboard custom integrat al lloc, amb l'estètica de pocallum (colors, Syne, IBM Plex, tema fosc). **Mai canviar el link del footer a una URL externa** — sempre apunta a `/admin/`.

### Arquitectura
- `static/admin/index.html` — dashboard HTML (autocontingut, protegit per contrasenya SHA-256)
- `static/admin/analytics.json` — dades generades automàticament cada hora per GitHub Actions
- `scripts/build-analytics-json.py` + `scripts/process-analytics.py` — scripts que criden l'API de GoatCounter
- `.github/workflows/fetch-analytics.yml` — workflow que s'executa cada hora (`cron: '0 * * * *'`)

### Secret requerit a GitHub
El workflow necessita el secret `GOATCOUNTER_TOKEN` al repo (Settings → Secrets and variables → Actions).
Per generar-lo: `pocallum.goatcounter.com` → Settings → API tokens → New token → Read stats ✓

**Si `analytics.json` té zeros**, el secret falta o és invàlid. Solució: regenerar el token a GoatCounter i afegir-lo a GitHub Secrets, després llançar manualment el workflow (Actions → Fetch GoatCounter Analytics → Run workflow).

### Contrasenya del dashboard
Hash SHA-256 configurat a `static/admin/index.html` → variable `pwHash`. Per canviar la contrasenya:
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
```

---

## Pendent d'implementar

- **Secció Festivals** — content type, plantilles, CSS, 5 fitxers inicials (vijazz, blues-bcn, arundo-donax, im-jazz, flamenco-barrio)
- **Copy serveis** — actualitzar `data/serveis.yaml` amb el text aprovat (veure spec)
- **Formulari pressupost** — crear wizard 4 passos a tally.so + afegir ID a `hugo.toml`
- **Logo** — exportar `pocallum-logo.png` amb fons transparent (ara funciona amb mix-blend-mode)

Spec complet: `docs/superpowers/specs/2026-05-05-festivals-serveis-formulari-design.md`

---

## Fora d'abast (no tocar en aquesta fase)

- Newsletter / mailing list
- Botiga o e-commerce amb mercandatge propi
- Castellà activat
- Blog integrat (`blog.pocallum.cat` és independent) <--- compte al passar a producció!
- Formació fotogràfica (→ Llumàtics)
- Backend per publicar notícies, festivals, fotos a galeria.

