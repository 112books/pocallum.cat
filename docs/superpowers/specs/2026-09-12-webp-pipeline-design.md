# Spec: WebP Image Pipeline — pocallum.cat

**Data:** 2026-09-12
**Estat:** Aprovat

---

## Objectiu

Reduir el pes de les imatges del lloc en un 35-45% sense pèrdua visual perceptible, servint WebP amb `srcset` responsive (800px, 1600px, full) i mantenint JPEG com a fallback.

---

## Decisió d'arquitectura

**Opció escollida: script de pre-conversió local + partial `picture.html`**

Les imatges romanen a `static/images/` (no es mouen a `assets/`). Un script local genera les variants WebP que es commiten al repo. Els templates fan servir un partial nou `picture.html`. Hugo Pipes no s'usa — la conversió és offline.

Motius: builds ràpids a GitHub Actions, control de qualitat explícit, cap canvi d'estructura al repo.

---

## Peces

### 1. `scripts/convert-images.sh`

Converteix JPEGs a WebP. Per cada `foto.jpg` genera:

```
foto.webp        — mida original, qualitat WebP 85
foto-800.webp    — 800px ample, qualitat WebP 85
foto-1600.webp   — 1600px ample, qualitat WebP 85
```

**Comportament:**
- Recorre `static/images/galeria/`, `static/images/festivals/`, `static/images/noticies/` i subdirectoris
- Idempotent: salta si el `.webp` ja existeix i és més nou que el `.jpg`
- Flag `--force` per reprocessar tot
- Accepta un fitxer concret com a argument: `./scripts/convert-images.sh static/images/galeria/nova-foto.jpg`
- Dep: ImageMagick (`brew install imagemagick`)
- Qualitat 85: conserva tots els detalls visuals per a fotografia professional

**Ús habitual en afegir una foto nova:**
```bash
./scripts/convert-images.sh static/images/galeria/nova-foto.jpg
```

### 2. `themes/pocallum/layouts/partials/picture.html`

Partial que substitueix els `<img>` de contingut arreu del lloc.

**Paràmetres d'entrada:**
- `src` — path JPEG (ex: `/images/galeria/foto.jpg`)
- `alt` — text alternatiu
- `loading` — `"lazy"` (per defecte) o `"eager"`
- `width` — amplada en px (opcional)
- `height` — alçada en px (opcional)
- `class` — classe CSS (opcional)

**Output:**
```html
<picture>
  <source
    type="image/webp"
    srcset="/images/galeria/foto-800.webp 800w,
            /images/galeria/foto-1600.webp 1600w,
            /images/galeria/foto.webp 2400w"
    sizes="(max-width: 800px) 800px, (max-width: 1600px) 1600px, 100vw">
  <img src="/images/galeria/foto.jpg"
       alt="..."
       width="..." height="..."
       loading="lazy" decoding="async">
</picture>
```

- Els paths WebP es deriven automàticament del `src` JPEG — cap canvi al frontmatter
- Fallback `<img>` apunta al JPEG original → compatibilitat total
- El **lightbox** (`data-lb-src` a `foto-card.html`) continua apuntant al JPEG original per màxima qualitat en vista ampliada

### 3. Actualització de templates

Substitució mecànica de `<img>` per `{{ partial "picture.html" }}`:

| Template | Imatge afectada |
|---|---|
| `partials/foto-card.html` | Galeria — totes les fotos |
| `festivals/single.html` | Hero del festival |
| `festivals/list.html` | Card de llistat |
| `noticies/single.html` | Hero de l'article |
| `noticies/list.html` | Card de llistat |
| `index.html` | Grid 3×2 portada |

**No canvia:**
- OG image a `head.html` — JPEG (crawlers no entenen WebP universalment)
- Logo i assets UI — ja petits, sense impacte
- `data-lb-src` al lightbox — JPEG per màxima qualitat

### 4. Hero JS (portada)

El hero de portada s'assigna via JS a partir de `__heroData`. Afegir funció minimal a `assets/js/main.js`:

```js
function toWebP(url) {
  return url.replace(/\.(jpg|jpeg)$/i, '.webp');
}
```

Usar `toWebP(url)` en lloc de `url` directe en l'assignació `img.src`. Sense detecció de suport — WebP és suportat per +96% de navegadors (Safari 14+, 2020).

---

## Workflow complet per a fotos noves

```bash
# 1. Afegir la foto original
cp nova-foto.jpg static/images/galeria/

# 2. Convertir a WebP (genera les 3 variants)
./scripts/convert-images.sh static/images/galeria/nova-foto.jpg

# 3. Crear el frontmatter
hugo new galeria/2026-09-12-nova-foto.md

# 4. Commitear tot (jpg + webp variants + md)
git add static/images/galeria/nova-foto* content/ca/galeria/...
git commit -m "foto: ..."
```

---

## Impacte estimat

| Categoria | Pes actual | Pes estimat post-WebP |
|---|---|---|
| Galeria (235 fotos) | ~203 MB | ~120-130 MB (WebP full) + ~25 MB (800px) + ~45 MB (1600px) |
| Festivals | ~19 MB | ~11 MB + variants |
| Notícies | ~38 MB | ~22 MB + variants |
| **Total repo** | ~260 MB imatges | ~230 MB (+variants, -pes per foto servida) |

El pes **servit al navegador** baixa un 35-45% per visita. El pes del repo puja lleugerament per les variants però les fotos originals es mantenen.

---

## Fora d'abast

- Conversió AVIF (suport encara no universal, es pot afegir després)
- Hugo Pipes o CDN d'imatges
- Automatització al CI (GitHub Actions) — conversió sempre local
