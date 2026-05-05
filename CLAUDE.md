# CLAUDE.md — pocallum.cat

> Guia operativa per a Claude Code en aquest projecte.

## Projecte

Web oficial de **Pocallum**, servei fotogràfic cultural de Joan Linux Martínez. Especialitzat en jazz, blues, música, teatre, dansa i arts escèniques. Construït amb Hugo (static site generator), tema custom i continguts en Markdown.

Migrat de WordPress a Hugo. El WordPress roman actiu fins al tall final del domini.

- **Producció:** `https://pocallum.cat` → VPS Dinahosting → rsync via GitHub Action
- **Staging:** GitHub Pages (branca `develop`)
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
| JS | Vanilla JS mínim (galeria random + lightbox) |
| Idiomes | CA (per defecte), EN, ES (preparat, no activat) |
| Formulari | Tally.so (embed iframe) |
| Analytics | GoatCounter (sense cookies, GDPR) |
| DNS/Domini | Dinahosting |

**Fonts:**
- `Chicago FLF` → logo/wordmark (autoallotjada, `static/fonts/`)
- `Syne Bold` → títols display (Google Fonts)
- `Inter` → cos del text
- `IBM Plex Mono` → labels, dates, detalls

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
git push origin develop     # activa GitHub Action → GitHub Pages
```

### Producció (branca main)
```bash
git checkout main
git merge develop
git push origin main        # activa GitHub Action → rsync Dinahosting
```

---

## Estructura de directoris

```
pocallum.cat/
├── .github/workflows/         # CI/CD GitHub Actions
├── themes/pocallum/           # tema custom
│   ├── assets/css/main.css    # tots els estils
│   ├── assets/js/main.js      # galeria random + lightbox
│   └── layouts/               # templates Hugo
│       ├── _default/          # baseof, list, single
│       ├── index.html         # portada
│       ├── galeria/           # galeria random
│       ├── noticies/          # llistat + single articles
│       └── partials/          # head, header, footer, foto-card
├── content/
│   ├── ca/                    # contingut català (per defecte)
│   └── en/                    # contingut anglès
├── data/
│   └── serveis.yaml           # serveis fotogràfics (no pàgines)
├── i18n/
│   ├── ca.yaml                # strings UI català
│   ├── en.yaml                # strings UI anglès
│   └── es.yaml                # preparat, buit
├── static/
│   ├── fonts/                 # Chicago FLF .woff2
│   └── images/                # fotografies
├── archetypes/                # plantilles hugo new
└── hugo.toml                  # configuració principal
```

---

## Idiomes

- **CA** (català) — idioma per defecte, `defaultContentLanguage = "ca"`
- **EN** (anglès) — secundari, `contentDir = "content/en"`
- **ES** (castellà) — preparat però **no activat**: `es.yaml` buit, sense contingut, no apareix al selector

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
--bg:   #080808   /* fons principal */
--bg2:  #111111   /* fons seccions alternes */
--fg:   #f5f5f5   /* text principal */
--mid:  #888888   /* text secundari */
--line: #1a1a1a   /* separadors */
```
Cap accent de color. Les fotografies porten tota la vida cromàtica.

### Principis de disseny
- Negre profund + blanc pur, res entremig excepte gris per a text secundari
- Tipografia **molt gran** com a element de disseny (titols 4–6rem)
- La imatge mana — layouts que donin espai a les fotos
- Estètica jazz: minimalisme editorial, no decoració
- Referència visual: `malditasmaquinas.com` (mateix autor)

---

## Galeria — comportament especial

La galeria (`/galeria/`) mostra les fotografies en **ordre aleatori en cada càrrega**. El shuffle es fa via JS al client, no al servidor. Implementació:

```js
// Agafar tots els elements de la graella i reordenar-los aleatòriament
const items = [...document.querySelectorAll('.foto-item')];
items.sort(() => Math.random() - 0.5);
items.forEach(el => grid.appendChild(el));
```

A la portada, les darreres 8 fotografies s'mostren en ordre cronològic invers (sense shuffle).

---

## To i veu

- **Idioma principal:** català
- **To:** proper, directe, punyent — ni corporatiu ni servil
- **Personalitat:** artista i professional, no proveïdor de serveis estàndard
- **Evitar:** markerting genèric, superlatifs buits, frases fetes del sector
- **Exemple de veu:** "Hi ha fotògrafs que fan fotos de grups. I hi ha fotògrafs que entenen la música."

---

## Comandes útils

```bash
# Nou article de notícies
hugo new noticies/2026-01-titol.md

# Nova fotografia de galeria
hugo new galeria/2026-01-nom-foto.md

# Build de producció (minificat)
hugo --minify

# Comprovar links trencats
hugo --gc --minify && npx broken-link-checker http://localhost:1313
```

---

## Fora d'abast (no tocar en aquesta fase)

- Newsletter / mailing list
- Botiga o e-commerce
- Castellà activat
- Blog integrat (`blog.pocallum.cat` és independent)
- Formació fotogràfica (→ Llumàtics)
