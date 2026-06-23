# ACTION PLAN SEO — pocallum.cat
**Data:** 23 juny 2026 | **Auditors:** 7 agents especialitzats en paral·lel
**Última actualització:** 23 juny 2026 (sessió de treball)

---

## Scores per àrea

| Àrea | Score |
|------|-------|
| SEO Tècnic | 78/100 |
| SEO Local | 54/100 |
| GEO / IA Search | 74/100 |
| SXO (Search Experience) | 61/100 |
| Performance (CWV est.) | ~55/100 |
| **GLOBAL ESTIMAT** | **~64/100** |

---

## CRÍTIC — Fer aquesta setmana

### C1 · Crear i verificar Google Business Profile ⬅ PENDENT
**Impacte: Local SEO +20 pts | Esforç: 2h**

Sense GBP, pocallum.cat és invisible al local pack de Google per a qualsevol cerca amb intent local.
- Categoria principal: "Photographer"
- Categoria secundària: "Photography Studio"
- NAP exacte: `Pocallum | Carrer dels Ferrocarrils Catalans, 2-14, 08020 Barcelona | +34 687 836 757`
- Afegir 10+ fotos de portfolio, horaris, URL del web
- Un cop verificat: afegir la URL de GBP a `sameAs` a `head.html`

### ~~C2 · Corregir les capçaleres dels serveis trencades a `/serveis/`~~ ✅ FET 2026-06-23
**Impacte: On-page keywords | Esforç: 15 min**

La pàgina live renderitza `<h3></h3>` buits perquè el template llegeix `.nom` però `serveis.yaml` usa `.titol`.
- Fitxer: cercar a `themes/pocallum/layouts/` on es llegeix `.nom` o `.nom_en`
- Canviar per `.titol` i `.titol_en`

### C3 · Fer el hero de portada server-rendered (LCP) ⬅ PENDENT
**Impacte: LCP -1.5–2s | Esforç: 2–3h**

L'hero és un `background-image` injectat per JS — el browser no el pot precarregar. LCP estimat 3–4s+.
- Triar la imatge hero a build time en el template Hugo (ex: `index $gal (now.Unix | mod (len $gal))`)
- Renderitzar com `<img fetchpriority="high" loading="eager">` en lloc de JS background
- Preload exacte en `<head>` de la imatge seleccionada
- El fade-in CSS pot continuar: `opacity:0` inicial → `opacity:1` on load

---

## ALT — Fer aquest mes

### ~~A1 · Afegir "Barcelona" al H1 i title de `/serveis/`~~ ✅ FET 2026-06-23
**Impacte: Rankings locals | Esforç: 5 min**

- CA: `<h1>Serveis fotogràfics a Barcelona</h1>` i `title: "Serveis fotogràfics a Barcelona — Pocallum"`
- EN: `<h1>Photography services in Barcelona</h1>` i title equivalent
- Fitxers: `content/ca/serveis/_index.md` i `content/en/serveis/_index.md`

### ~~A2 · Afegir meta descriptions a totes les pàgines principals~~ ✅ FET 2026-06-23
**Impacte: CTR des de SERPs | Esforç: 1h**

Pàgines sense description explícita: `/serveis/`, `/qui-som/`, `/contacte/`, `/festivals/`, sub-pàgines de serveis.
Cada una necessita 140–155 caràcters amb keyword + CTA suau.

### ~~A3 · Corregir `og:type` per a pàgines de secció~~ ✅ FET 2026-06-23
**Impacte: Social sharing | Esforç: 10 min**

`themes/pocallum/layouts/partials/head.html` línia 56 — canviar:
```html
content="{{ if or .IsHome .IsSection }}website{{ else }}article{{ end }}"
```

### ~~A4 · Corregir hreflang `x-default` a les pàgines EN~~ ✅ FET 2026-06-23
**Impacte: Hreflang correcte | Esforç: 20 min**

A `head.html` línies 38–44: el `x-default` només surt a CA. Fer que surti a totes les pàgines independentment de l'idioma actiu.

### A5 · ~~Corregir double-encoding al BreadcrumbList~~ — REVISAT, no és un bug real
**Impacte: Rich results | Esforç: 20 min**

`themes/pocallum/layouts/partials/schema-breadcrumb.html` — el nom del breadcrumb surt amb cometes dobles escapades (`\"nom\"`). Revisar el `jsonify` duplicat.

### ~~A6 · Afegir `translationKey` a les pàgines de serveis CA/EN~~ ✅ FET 2026-06-23
**Impacte: Hreflang entre serveis | Esforç: 30 min**

Sense `translationKey`, Hugo no relaciona `concerts.md` (CA) amb `live-music.md` (EN). El sitemap no emet hreflang cross-links entre ells.
- Afegir a cada parell de fitxers: `translationKey: serveis-concerts` (etc.)

### ~~A7 · Afegir el telèfon visible al contingut de `/contacte/`~~ ✅ JA ESTAVA
**Impacte: NAP consistency, conversió | Esforç: 5 min**

El telèfon `+34 687 836 757` existeix al schema i hugo.toml però no és visible a cap pàgina. Afegir-lo a `content/ca/contacte/_index.md` i EN equivalent.

### A8 · Corregir dates futures al sitemap (festivals) ⬅ PENDENT
**Impacte: Crawl trust | Esforç: 1h**

Festivals amb `date:` a 2030 com a truc d'ordenació fan que el sitemap index tingui lastmod 2030-01-09. Google descarta aquest senyal.
- Estratègia: usar `weight:` per ordenació, posar `date:` a l'any real
- O: activar `enableGitInfo = true` a `hugo.toml` + `fetch-depth: 0` a GitHub Actions

### A9 · Publicar 3–5 testimonis de clients ⬅ PENDENT (requereix contingut teu)
**Impacte: Trust signals, rankings | Esforç: 1–2h redacció**

Zero testimonis a tot el lloc. Afegir a `/serveis/` i portada: nom, càrrec/organització, 1–2 frases.
Formats buscats per Google per als rich results (amb AggregateRating schema un cop existeixin).

### A10 · Corregir `og:image` fallback per a pàgines de secció ⬅ PENDENT
**Impacte: Social sharing | Esforç: 30 min**

Totes les pàgines sense `params.image` usen el logo. Per a seccions, usar la primera imatge del contingut:
```hugo
{{- if .IsSection -}}{{- $firstPage := index .Pages 0 -}}{{- with $firstPage.Params.image -}}...
```

---

## MITJÀ — Fer en 1–2 mesos

### M1 · Crear 3 landing pages amb keyword targeting — PARCIAL ✅
**Impacte: CRÍTIC per a rankings orgànics | Esforç: 3–4h per landing**

La web competeix amb pàgines de marca contra pàgines de query i perd. Cap URL de pocallum.cat apareix per "fotògraf concerts Barcelona" o "concert photographer Barcelona".

Prioritat:
1. ~~`/serveis/concerts-barcelona/`~~ → ampliat `/serveis/concerts/` CA+EN ✅ FET 2026-06-23
2. ~~`/serveis/teatre-dansa-barcelona/`~~ → ampliat `/serveis/teatre-dansa/` CA+EN ✅ FET 2026-06-23
3. `/serveis/festivals-i-sales/` CA+EN — pendent ⬅

Cada landing: 400+ paraules, FAQ (4 preguntes), schema `Service`, CTA únic, 6–8 imatges inline.

### ~~M2 · Ampliar el cos de text de les pàgines de serveis a 140–160 paraules~~ ✅ FET (concerts + teatre-dansa)
**Impacte: AI citability, E-E-A-T | Esforç: 2h**

Les pàgines de serveis actuals tenen menys de 100 paraules de prosa. Per a ser citades per ChatGPT/Perplexity cal un paràgraf inicial de 140–160 paraules que respongui: a qui va dirigit, què inclou, per què Pocallum, 1 credencial específica.

### ~~M3 · Afegir `width` i `height` a les imatges del `foto-card`~~ ✅ FET 2026-06-23
**Impacte: CLS | Esforç: 30 min**

`themes/pocallum/layouts/partials/foto-card.html` — afegir dimensions per evitar layout shift.

### ~~M4 · Ocultar la galeria abans del shuffle JS, revelar després~~ ✅ FET 2026-06-23
**Impacte: CLS -0.1–0.15 | Esforç: 30 min**

La galeria pateix layout shift quan el JS aplica les classes de mida mosaic.
- CSS: `.foto-grid--galeria { opacity: 0; }`
- JS: afegir `grid.style.opacity = '1'` just després d'aplicar totes les classes

### M5 · Afegir schema `LocalBusiness` a `/contacte/` i `/serveis/` ⬅ PENDENT
**Impacte: Schema coverage | Esforç: 30 min**

Ara el schema `LocalBusiness` només és a la portada. Afegir-lo (o una versió condensada) a totes les pàgines.

### M6 · Corregir el tipus de schema als festivals no musicals ⬅ PENDENT
**Impacte: Schema accuracy | Esforç: 30 min**

`MusicFestival` és incorrecte per a festivals de teatre, circ, carnaval. Afegir condició al template:
- Si `disciplina` conté "Jazz", "Blues", "Música" → `MusicFestival`
- Altrament → `Festival`

### ~~M7 · Afegir RSL 1.0 a `llms.txt`~~ ✅ FET 2026-06-23
**Impacte: AI crawler permissions | Esforç: 5 min**

Afegir a la primera línia de `static/llms.txt`:
```
> License: RSL 1.0 — https://retrieval.sourceforge.net/rsl-1.0/
> This content is licensed for AI retrieval and citation. Not for model training.
```

### M8 · Afegir bloc "Sobre l'autor" a les notícies ⬅ PENDENT
**Impacte: E-E-A-T, AI authority | Esforç: 1h**

`noticies/single.html` — afegir partial al peu de cada article: 40 paraules amb credencials verificables (anys d'activitat, festivals, llibres publicats).

### ~~M9 · Moure `__heroData` inline script al final del `<body>`~~ ✅ FET 2026-06-23
**Impacte: LCP -0.1–0.2s | Esforç: 20 min**

El JSON de 152 imatges és un script inline que bloqueja el parser. Moure'l al final del body o usar `<template>`.

### ~~M10 · Activar `disableHugoGeneratorInject = true` a `hugo.toml`~~ ✅ FET 2026-06-23
**Impacte: Seguretat minor | Esforç: 1 min**

Oculta la versió de Hugo del meta generator.

---

## BAIX — Backlog

### B1 · IndexNow — notificació immediata d'indexació ⬅ PENDENT
Afegir fitxer clau a `static/` + step a GitHub Actions que pinga l'API en cada deploy.

### ~~B2 · Eliminar `<changefreq>` i `<priority>` del sitemap~~ ✅ FET 2026-06-23
Google els ignora. Simplificar `themes/pocallum/layouts/sitemap.xml` (línies 12–13).

### B3 · Excloure pàgines legals del sitemap ⬅ PENDENT
Afegir `sitemap: disable: true` a `content/ca/legal/` i equivalents EN. Cap valor SEO.

### B4 · Corregir el `<link rel="shortcut icon">` deprecated ⬅ PENDENT
Eliminar la línia deprecated de `head.html`. Mantenir només `rel="icon"`.

### B5 · Canal YouTube amb 3–5 vídeos curts ⬅ PENDENT (acció off-site)
El senyal YouTube té la correlació més alta amb citació per IA (0.737). Pujar el vídeo Vimeo existent + 2–3 clips de festivals. Afegir la URL a `sameAs`.

### B6 · Uniformitzar les dates a `llms.txt` ⬅ PENDENT
CA diu "des del 2010" (marca), EN diu "active since 2002" (Joan com a fotògraf). Aclarir ambdós.

### B7 · Verificar i corregir coordenades geo al schema ⬅ PENDENT
`latitude: 41.40879, longitude: 2.19004` pot no correspondre exactament a Nau Bostik. Verificar amb Google Maps i usar 6 decimals.

### B8 · Facebook a `sameAs` del schema ⬅ PENDENT
El param `facebook` existeix a `hugo.toml` però no s'inclou a `sameAs`. Afegir.

---

## Resum executiu

| Prioritat | Accions | Impacte principal |
|-----------|---------|-------------------|
| CRÍTIC (3) | GBP, hero LCP, serveis broken | Local pack + velocitat |
| ALT (10) | Keywords, hreflang, schema, NAP | Rankings + estructura |
| MITJÀ (10) | Landing pages, citabilitat IA, CLS | Visibilitat long-tail |
| BAIX (8) | YouTube, sitemap, llms.txt | Brand authority |

**Quick wins (menys de 30 min cadascun):** C2, A1, A3, A4, A5, A7, M7, M10, B4 — total ~3h de treball per corregir 9 issues.
