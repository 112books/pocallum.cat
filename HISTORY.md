# HISTORY — pocallum.cat

Registre de sessions de treball i canvis rellevants.

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
