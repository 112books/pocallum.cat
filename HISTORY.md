# HISTORY — pocallum.cat

Registre de sessions de treball i canvis rellevants.

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
