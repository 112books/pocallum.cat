# HISTORY — pocallum.cat

Registre de sessions de treball i canvis rellevants.

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
