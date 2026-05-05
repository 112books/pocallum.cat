# Disseny — pocallum.cat (migració WordPress → Hugo)

**Data:** 2026-05-05  
**Estat:** Aprovat  
**Autor:** Joan Linux Martínez / Claude Code

---

## 1. Visió general

Migració del web de **Pocallum** (servei fotogràfic cultural, Barcelona) de WordPress a Hugo static site generator. El nou web prioritza la imatge com a protagonista absoluta, amb una estètica jazz: negre profund, blanc pur, tipografia gran i editorial.

**Pocallum** és un servei fotogràfic especialitzat en cultura: jazz, blues, música, teatre, dansa i arts escèniques. No és una escola (Llumàtics s'encarrega de la formació). És un projecte personal i artístic, diferent dels serveis convencionals.

**URL:** `https://pocallum.cat`  
**Idioma principal:** Català  
**Idioma secundari:** Anglès  
**Preparat per a:** Castellà (es.yaml buit, contingut sense traduir, sense activar al menú)

---

## 2. Stack tècnic

| Capa | Tecnologia |
|------|-----------|
| SSG | Hugo v0.159+ extended |
| Tema | Custom `themes/pocallum/` |
| CSS | Vanilla CSS amb custom properties |
| JS | Vanilla JS mínim (galeria random, lightbox) |
| Idiomes | CA (per defecte), EN, ES (preparat) |
| Formulari contacte | Tally.so (embed iframe) |
| Analytics | GoatCounter (sense cookies, GDPR) |
| Fonts | Chicago FLF (autoallotjada), Syne (Google Fonts), Inter, IBM Plex Mono |

---

## 3. Entorns i desplegament

| Entorn | URL | Branca | Mecanisme |
|--------|-----|--------|-----------|
| Local | `localhost:1313` | qualsevol | `hugo server -D` |
| Staging | `<usuari>.github.io/pocallum-cat` | `develop` | GitHub Action |
| Producció | `https://pocallum.cat` | `main` | GitHub Action → rsync → VPS Dinahosting |

El WordPress actual roman actiu fins que el nou web estigui aprovat a staging i el domini es talli.

---

## 4. Estructura de directoris

```
pocallum.cat/
├── .github/
│   └── workflows/
│       ├── deploy-staging.yml    # develop → GitHub Pages
│       └── deploy-prod.yml       # main → rsync Dinahosting
├── themes/pocallum/
│   ├── assets/
│   │   ├── css/main.css          # tots els estils
│   │   └── js/main.js            # galeria random, lightbox
│   └── layouts/
│       ├── _default/
│       │   ├── baseof.html
│       │   ├── list.html
│       │   └── single.html
│       ├── index.html            # portada
│       ├── galeria/
│       │   └── list.html         # galeria random
│       ├── noticies/
│       │   ├── list.html
│       │   └── single.html
│       └── partials/
│           ├── head.html
│           ├── header.html
│           ├── footer.html
│           └── foto-card.html
├── content/
│   ├── ca/
│   │   ├── _index.md
│   │   ├── galeria/              # una entrada per foto
│   │   ├── noticies/             # articles de notícies
│   │   ├── serveis/_index.md
│   │   ├── qui-som/_index.md
│   │   └── contacte/_index.md
│   └── en/
│       └── (mirall de ca/)
├── data/
│   └── serveis.yaml              # definició dels serveis (no pàgines)
├── i18n/
│   ├── ca.yaml
│   ├── en.yaml
│   └── es.yaml                   # preparat, buit
├── static/
│   ├── fonts/                    # Chicago FLF .woff2 (autoallotjada)
│   └── images/                   # fotografies
├── archetypes/
│   ├── noticies.md
│   └── galeria.md
└── hugo.toml
```

---

## 5. Sistema visual

### Paleta de colors

```css
--bg:   #080808   /* quasi-negre — fons principal */
--bg2:  #111111   /* fons seccions alternes */
--fg:   #f5f5f5   /* blanc trencat — text principal */
--mid:  #888888   /* text secundari, dates, labels */
--line: #1a1a1a   /* línies separadores */
```

Cap color d'accent. Les fotografies porten tota la vida cromàtica.

### Tipografia

| Ús | Font | Característica |
|----|------|----------------|
| Logo/Wordmark | Chicago FLF | autoallotjada `.woff2`, propietari del projecte |
| Títols/Display | Syne Bold | Google Fonts, geomètrica, editorial, molt gran |
| Cos del text | Inter | neta, llegible, ja coneguda de llumatics |
| Labels/Dates | IBM Plex Mono | detalls, metadades, tocs tècnics |

La tipografia **és** el disseny. Títols a 4–6rem, molt espai blanc, molt contrast.

---

## 6. Pàgines

### 6.1 Portada (`/`)
- Hero: títol tipogràfic gran (Syne Bold, 6rem+) sobre fons negre, sense imatge de fons
- Graella 4×2 de les darreres 8 fotografies (ordre cronològic invers)
- Secció de 3 notícies recents
- CTA: "Demana pressupost" → `/contacte/`

### 6.2 Galeria (`/galeria/`)
- Totes les fotografies en masonry grid (3 columnes desktop, 2 tablet, 1 mobile)
- **Ordre aleatori en cada càrrega** (shuffle via JS, no fix de servidor)
- Lightbox natiu (JS mínim, sense deps externes)
- Cap filtre ni categoria — la barreja és la proposta

### 6.3 Serveis (`/serveis/`)
- Tres blocs temàtics:
  - **Cultura** — concerts, events, grups musicals, arts escèniques (teatre, dansa)
  - **Artistes** — books actorals, books artístics, perfil professional
  - **Empreses** — personal i instal·lacions, fotografies per a xarxes socials
- Cada servei: nom + descripció curta
- No hi ha preus. CTA al final: "Parlem del teu projecte" → `/contacte/`
- Contingut des de `data/serveis.yaml` (no pàgines individuals)

### 6.4 Notícies (`/noticies/`)
- Llistat d'articles en ordre cronològic invers
- Pàgina individual per cada article (single.html)
- Frontmatter: `title`, `date`, `lead`, `image`, `draft`

### 6.5 Qui som (`/qui-som/`)
- Text breu (3–5 paràgrafs) sobre Joan Linux i la filosofia de Pocallum
- Enllaç prominent → `https://about.pocallum.cat` per a la biografia completa
- Una fotografia de retrat
- No es manté sincronia amb `about.pocallum.cat` — cada un té la seva vida

### 6.6 Contacte (`/contacte/`)
- Text breu d'introducció ("Explica'ns el teu projecte")
- Embed iframe de Tally amb camps:
  - Nom i cognoms (obligatori)
  - Empresa (opcional)
  - Tipus de servei (selecció dels serveis disponibles)
  - Dates / període (text lliure)
  - Descriu el teu projecte o idea (text llarg)
- Email i telèfon visibles a sota del formulari

---

## 7. Tipus de contingut i frontmatter

### Notícia
```yaml
---
title: ""
date: 2026-01-01
lead: ""        # resum curt (max 160 cars)
image: ""       # /images/noticies/xxx.jpg
draft: false
---
```

### Fotografia de galeria
```yaml
---
title: ""
date: 2026-01-01
servei: "cultura"   # cultura | artistes | empreses
image: ""            # /images/galeria/xxx.jpg
draft: false
---
```

---

## 8. i18n

Tots els textos UI externalitzats a `i18n/ca.yaml` i `i18n/en.yaml`.  
`i18n/es.yaml` creat i buit — llest per a una traducció futura.  
El castellà **no apareix** al selector d'idioma fins que hi hagi contingut.

---

## 9. Navegació

```
[pocallum]  ·  Galeria  Serveis  Notícies  Qui som  Contacte  |  CA EN
```

- El logo "pocallum" és text en Chicago FLF (+ icona llum SVG si disponible)
- Menú horitzontal desktop, hamburger mobile
- Selector d'idioma discret a la dreta

---

## 10. Fora d'abast (no inclòs en aquesta fase)

- Formulari de newsletter / mailing list
- Botiga o e-commerce
- Castellà activat (preparat però no construït)
- Blog integrat (es manté a `blog.pocallum.cat` extern)
- Formació fotogràfica (va a Llumàtics)
- Fotografia de producte i gastronomia
