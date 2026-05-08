# HISTORY — pocallum.cat

Registre de sessions de treball i canvis rellevants.

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
