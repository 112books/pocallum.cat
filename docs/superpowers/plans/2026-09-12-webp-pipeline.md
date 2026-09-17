# WebP Image Pipeline — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Servir totes les imatges de contingut en WebP amb srcset responsive (800w/1600w/full), amb fallback JPEG, reduint el pes per visita un 35-45%.

**Architecture:** Script local de pre-conversió genera variants WebP que es commiten al repo. Un partial `picture.html` substitueix tots els `<img>` de contingut. El JS del hero i del grid aplica `toWebP()` en runtime. Builds no afectades (cap Hugo Pipes).

**Tech Stack:** Bash + ImageMagick (`brew install imagemagick`), Hugo partials, Vanilla JS.

---

## Fitxers

| Acció | Fitxer |
|---|---|
| Crear | `scripts/convert-images.sh` |
| Crear | `themes/pocallum/layouts/partials/picture.html` |
| Modificar | `themes/pocallum/layouts/partials/foto-card.html` |
| Modificar | `themes/pocallum/layouts/festivals/single.html` |
| Modificar | `themes/pocallum/layouts/festivals/list.html` |
| Modificar | `themes/pocallum/layouts/noticies/single.html` |
| Modificar | `themes/pocallum/layouts/noticies/list.html` |
| Modificar | `themes/pocallum/layouts/index.html` |
| Modificar | `themes/pocallum/assets/js/main.js` |

---

## Task 1: Script de conversió `scripts/convert-images.sh`

**Files:**
- Create: `scripts/convert-images.sh`

- [ ] **Step 1: Verificar que ImageMagick està instal·lat**

```bash
magick --version
```
Si falla: `brew install imagemagick`

- [ ] **Step 2: Crear el script**

```bash
#!/usr/bin/env bash
set -euo pipefail

QUALITY=85
DIRS=(
  "static/images/galeria"
  "static/images/festivals"
  "static/images/noticies"
)
FORCE=0
SINGLE_FILE=""

usage() {
  echo "Ús: $0 [--force] [fitxer.jpg]"
  echo "  --force      Regenera WebP encara que ja existeixi"
  echo "  fitxer.jpg   Converteix un sol fitxer (opcional)"
  exit 1
}

if ! command -v magick &>/dev/null; then
  echo "Error: ImageMagick no trobat. Instal·la amb: brew install imagemagick"
  exit 1
fi

convert_file() {
  local src="$1"
  local base="${src%.*}"
  local webp="${base}.webp"
  local w800="${base}-800.webp"
  local w1600="${base}-1600.webp"

  if [[ $FORCE -eq 1 || ! -f "$webp" || "$src" -nt "$webp" ]]; then
    magick "$src" -quality $QUALITY "$webp"
    echo "  → $webp"
  else
    echo "  skip $webp"
  fi

  if [[ $FORCE -eq 1 || ! -f "$w800" || "$src" -nt "$w800" ]]; then
    magick "$src" -resize '800x>' -quality $QUALITY "$w800"
    echo "  → $w800"
  else
    echo "  skip $w800"
  fi

  if [[ $FORCE -eq 1 || ! -f "$w1600" || "$src" -nt "$w1600" ]]; then
    magick "$src" -resize '1600x>' -quality $QUALITY "$w1600"
    echo "  → $w1600"
  else
    echo "  skip $w1600"
  fi
}

for arg in "$@"; do
  case "$arg" in
    --force) FORCE=1 ;;
    *.jpg|*.jpeg|*.JPG|*.JPEG) SINGLE_FILE="$arg" ;;
    *) usage ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

if [[ -n "$SINGLE_FILE" ]]; then
  [[ -f "$SINGLE_FILE" ]] || { echo "Error: fitxer no trobat: $SINGLE_FILE"; exit 1; }
  echo "Convertint: $SINGLE_FILE"
  convert_file "$SINGLE_FILE"
else
  for dir in "${DIRS[@]}"; do
    full_dir="$REPO_ROOT/$dir"
    if [[ ! -d "$full_dir" ]]; then
      echo "Avís: directori no trobat, saltant: $full_dir"
      continue
    fi
    echo "Processant: $dir"
    find "$full_dir" -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) | sort | while read -r f; do
      convert_file "$f"
    done
  done
fi

echo "Fet."
```

- [ ] **Step 3: Fer-lo executable**

```bash
chmod +x scripts/convert-images.sh
```

- [ ] **Step 4: Provar amb una sola foto**

```bash
./scripts/convert-images.sh static/images/festivals/$(ls static/images/festivals/*.jpg | head -1 | xargs basename)
```

Comprova que es generen els tres fitxers `.webp`, `-800.webp`, `-1600.webp`.

- [ ] **Step 5: Commit**

```bash
git add scripts/convert-images.sh
git commit -m "feat: afegeix script de conversió WebP (convert-images.sh)"
```

---

## Task 2: Partial `picture.html`

**Files:**
- Create: `themes/pocallum/layouts/partials/picture.html`

- [ ] **Step 1: Crear el partial**

```html
{{/*
  Partial: picture.html
  Paràmetres:
    src      — path JPEG (ex: /images/galeria/foto.jpg)
    alt      — text alternatiu
    loading  — "lazy" (per defecte) o "eager"
    width    — amplada px (opcional)
    height   — alçada px (opcional)
    class    — classe CSS (opcional)
    id       — id HTML (opcional)
*/}}
{{- $src     := .src -}}
{{- $alt     := .alt     | default "" -}}
{{- $loading := .loading | default "lazy" -}}
{{- $width   := .width   | default 0 -}}
{{- $height  := .height  | default 0 -}}
{{- $class   := .class   | default "" -}}
{{- $id      := .id      | default "" -}}
{{/* Deriva paths WebP a partir del JPEG */}}
{{- $base    := $src | replaceRE `(?i)\.(jpg|jpeg)$` "" -}}
{{- $srcJpeg := $src             | strings.TrimLeft "/" | relURL -}}
{{- $srcWebp := printf "%s.webp"      $base | strings.TrimLeft "/" | relURL -}}
{{- $src800  := printf "%s-800.webp"  $base | strings.TrimLeft "/" | relURL -}}
{{- $src1600 := printf "%s-1600.webp" $base | strings.TrimLeft "/" | relURL -}}
<picture>
  <source type="image/webp"
          srcset="{{ $src800 }} 800w, {{ $src1600 }} 1600w, {{ $srcWebp }} 2400w"
          sizes="(max-width: 800px) 800px, (max-width: 1600px) 1600px, 100vw">
  <img src="{{ $srcJpeg }}"
       alt="{{ $alt }}"
       {{- with $width }} width="{{ . }}"{{ end }}
       {{- with $height }} height="{{ . }}"{{ end }}
       {{- with $class }} class="{{ . }}"{{ end }}
       {{- with $id }} id="{{ . }}"{{ end }}
       loading="{{ $loading }}"
       decoding="async">
</picture>
```

- [ ] **Step 2: Verificar sintaxi Hugo**

```bash
hugo server -D 2>&1 | head -20
```

Comprova que no hi ha errors de template. El servidor pot arrencar encara que les imatges WebP no existeixin.

- [ ] **Step 3: Commit**

```bash
git add themes/pocallum/layouts/partials/picture.html
git commit -m "feat: partial picture.html amb srcset WebP + fallback JPEG"
```

---

## Task 3: `foto-card.html` — galeria

**Files:**
- Modify: `themes/pocallum/layouts/partials/foto-card.html:16-21`

- [ ] **Step 1: Substituir `<img>` pel partial**

Substitueix les línies 16-21 (el bloc `<img>`):

```html
{{/* BEFORE */}}
    <img src="{{ .Params.image | strings.TrimLeft "/" | relURL }}"
         alt="{{ $alt }}"
         width="{{ .Params.width | default 900 }}"
         height="{{ .Params.height | default 600 }}"
         loading="{{ .Scratch.Get "loading" | default "lazy" }}"
         decoding="async">
```

Per:

```html
{{/* AFTER */}}
    {{ partial "picture.html" (dict
      "src"     .Params.image
      "alt"     $alt
      "width"   (.Params.width  | default 900)
      "height"  (.Params.height | default 600)
      "loading" (.Scratch.Get "loading" | default "lazy")
    ) }}
```

- [ ] **Step 2: Verificar**

```bash
hugo server -D
```

Obre `http://localhost:1313/galeria/` i inspecciona el DOM: les fotos han de tenir `<picture>` amb `<source type="image/webp">`. El fallback `<img src>` ha d'apuntar al `.jpg`.

- [ ] **Step 3: Commit**

```bash
git add themes/pocallum/layouts/partials/foto-card.html
git commit -m "feat: foto-card usa partial picture.html (WebP + srcset)"
```

---

## Task 4: Templates `festivals/`

**Files:**
- Modify: `themes/pocallum/layouts/festivals/single.html:7-10` i `59-61`
- Modify: `themes/pocallum/layouts/festivals/list.html:13-15`

- [ ] **Step 1: `festivals/single.html` — hero (línies 7-10)**

```html
{{/* BEFORE */}}
    <img class="festival-single__hero-img"
         src="{{ . | strings.TrimLeft "/" | relURL }}"
         alt="{{ $.Title }}"
         loading="eager">
```

```html
{{/* AFTER */}}
    {{ partial "picture.html" (dict
      "src"     .
      "alt"     $.Title
      "loading" "eager"
      "class"   "festival-single__hero-img"
    ) }}
```

- [ ] **Step 2: `festivals/single.html` — nav strip thumbs (línies 59-61)**

```html
{{/* BEFORE */}}
            <img src="{{ . | strings.TrimLeft "/" | relURL }}" alt="" loading="lazy">
```

```html
{{/* AFTER */}}
            {{ partial "picture.html" (dict "src" . "alt" "" "loading" "lazy") }}
```

- [ ] **Step 3: `festivals/list.html` — card images (línies 13-15)**

```html
{{/* BEFORE */}}
      <img src="{{ . | strings.TrimLeft "/" | relURL }}"
           alt="{{ $p.Title }}"
           loading="{{ if eq $i 0 }}eager{{ else }}lazy{{ end }}">
```

```html
{{/* AFTER */}}
      {{- $loading := "lazy" -}}
      {{- if eq $i 0 -}}{{- $loading = "eager" -}}{{- end -}}
      {{ partial "picture.html" (dict
        "src"     .
        "alt"     $p.Title
        "loading" $loading
      ) }}
```

- [ ] **Step 4: Verificar**

```bash
hugo server -D
```

Obre `http://localhost:1313/ca/festivals/`. Comprova `<picture>` al DOM als cards i al hero del primer festival.

- [ ] **Step 5: Commit**

```bash
git add themes/pocallum/layouts/festivals/single.html themes/pocallum/layouts/festivals/list.html
git commit -m "feat: festivals usa partial picture.html (WebP + srcset)"
```

---

## Task 5: Templates `noticies/`

**Files:**
- Modify: `themes/pocallum/layouts/noticies/single.html:7-10` i `95-97`
- Modify: `themes/pocallum/layouts/noticies/list.html:22-23` i `55-57`

- [ ] **Step 1: `noticies/single.html` — hero (línies 7-10)**

```html
{{/* BEFORE */}}
    <img src="{{ .Params.image | strings.TrimLeft "/" | relURL }}"
         alt="{{ .Title }}"
         class="article-jazz__hero-img"
         loading="eager">
```

```html
{{/* AFTER */}}
    {{ partial "picture.html" (dict
      "src"     .Params.image
      "alt"     .Title
      "loading" "eager"
      "class"   "article-jazz__hero-img"
    ) }}
```

- [ ] **Step 2: `noticies/single.html` — nav strip thumbs (línies 95-97)**

```html
{{/* BEFORE */}}
            <img src="{{ . | strings.TrimLeft "/" | relURL }}" alt="" loading="lazy">
```

```html
{{/* AFTER */}}
            {{ partial "picture.html" (dict "src" . "alt" "" "loading" "lazy") }}
```

- [ ] **Step 3: `noticies/list.html` — featured image (línies 22-23)**

```html
{{/* BEFORE */}}
      <img src="{{ . | strings.TrimLeft "/" | relURL }}" alt="{{ $first.Title }}" id="js-nf-imgel">
```

```html
{{/* AFTER */}}
      {{ partial "picture.html" (dict
        "src"     .
        "alt"     $first.Title
        "loading" "eager"
        "id"      "js-nf-imgel"
      ) }}
```

- [ ] **Step 4: `noticies/list.html` — strip thumbs (línies 55-57)**

```html
{{/* BEFORE */}}
            <img src="{{ . | strings.TrimLeft "/" | relURL }}" alt="" loading="lazy">
```

```html
{{/* AFTER */}}
            {{ partial "picture.html" (dict "src" . "alt" "" "loading" "lazy") }}
```

- [ ] **Step 5: Verificar**

```bash
hugo server -D
```

Obre `http://localhost:1313/ca/noticies/`. Comprova `<picture>` al DOM a la imatge destacada i als thumbnails.

- [ ] **Step 6: Commit**

```bash
git add themes/pocallum/layouts/noticies/single.html themes/pocallum/layouts/noticies/list.html
git commit -m "feat: noticies usa partial picture.html (WebP + srcset)"
```

---

## Task 6: `index.html` — secció notícies preview

**Files:**
- Modify: `themes/pocallum/layouts/index.html:135`

- [ ] **Step 1: Substituir `<img>` notícies preview (línia 135)**

```html
{{/* BEFORE */}}
          <img src="{{ .Params.image | strings.TrimLeft "/" | relURL }}" alt="" loading="lazy">
```

```html
{{/* AFTER */}}
          {{ partial "picture.html" (dict "src" .Params.image "alt" "" "loading" "lazy") }}
```

- [ ] **Step 2: Verificar**

```bash
hugo server -D
```

Obre `http://localhost:1313/ca/` i comprova la secció de notícies recents al DOM.

- [ ] **Step 3: Commit**

```bash
git add themes/pocallum/layouts/index.html
git commit -m "feat: notícies preview portada usa partial picture.html"
```

---

## Task 7: `main.js` — `toWebP()` per a hero i grid JS

**Files:**
- Modify: `themes/pocallum/assets/js/main.js`

Els blocs JS que construeixen imatges dinàmicament no poden usar el partial Hugo. S'aplica `toWebP()` en runtime.

- [ ] **Step 1: Afegir `toWebP()` a l'inici del bloc hero (abans de la línia 1)**

Afegeix al capdamunt de `main.js`, abans de tot el codi existent:

```js
/* ── Utilitat WebP ───────────────────────────────────────────────────────── */
function toWebP(url) {
  return url ? url.replace(/\.(jpg|jpeg)$/i, '.webp') : url;
}
```

- [ ] **Step 2: Bloc hero — aplicar `toWebP()` (línies 44-53)**

```js
// BEFORE
  const heroImg = bg.querySelector('img');
  if (images.length > 0) {
    const src = images[Math.floor(Math.random() * images.length)];
    const loader = new Image();
    loader.onload = () => {
      if (heroImg) { heroImg.src = src; }
      bg.classList.add('is-loaded');
    };
    loader.src = src;
  }
```

```js
// AFTER
  const heroImg = bg.querySelector('img');
  if (images.length > 0) {
    const src = images[Math.floor(Math.random() * images.length)];
    const loader = new Image();
    loader.onload = () => {
      if (heroImg) { heroImg.src = toWebP(src); }
      bg.classList.add('is-loaded');
    };
    loader.src = toWebP(src);
  }
```

- [ ] **Step 3: Grid de portada — aplicar `toWebP()` a la `<img>` (línia ~143)**

Dins el bloc `selected.forEach(function (foto, i) { ... })`, localitza la línia:

```js
// BEFORE (línia ~143)
      '<img src="' + src + '" alt="' + alt + '" loading="' + (i < 2 ? 'eager' : 'lazy') + '" decoding="async">' +
```

```js
// AFTER
      '<img src="' + toWebP(src) + '" alt="' + alt + '" loading="' + (i < 2 ? 'eager' : 'lazy') + '" decoding="async">' +
```

Nota: `fig.dataset.lbSrc = src` i `href="' + src + '"'` es mantenen amb JPEG — el lightbox mostra la màxima qualitat.

- [ ] **Step 4: Timeline switcher de notícies — aplicar `toWebP()` (línies ~244-250)**

```js
// BEFORE
      const img = imgWrap.querySelector('img');
      if (t.dataset.img) {
        if (img) { img.src = t.dataset.img; img.alt = t.dataset.title || ''; }
        else { imgWrap.innerHTML = `<img src="${t.dataset.img}" alt="">`; }
      } else {
        imgWrap.innerHTML = '';
      }
```

```js
// AFTER
      if (t.dataset.img) {
        imgWrap.innerHTML = `<img src="${toWebP(t.dataset.img)}" alt="${t.dataset.title || ''}">`;
      } else {
        imgWrap.innerHTML = '';
      }
```

- [ ] **Step 5: Verificar**

```bash
hugo server -D
```

Obre `http://localhost:1313/ca/`, obre DevTools → Network → filtra per `img`. Comprova que el hero carrega `.webp` i el grid de portada carrega `.webp`. A notícies, fes clic als thumbnails i comprova que la imatge destacada canvia a WebP.

- [ ] **Step 6: Commit**

```bash
git add themes/pocallum/assets/js/main.js
git commit -m "feat: hero, grid portada i switcher notícies usen WebP via toWebP()"
```

---

## Task 8: Convertir totes les imatges existents i fer push

- [ ] **Step 1: Executar la conversió completa**

```bash
./scripts/convert-images.sh
```

Espera que acabi (pot trigar 5-15 minuts per a 235+ fotos). Hauries de veure `→ static/images/galeria/nom-foto.webp` per cada foto.

- [ ] **Step 2: Verificar que s'han generat els tres fitxers per foto**

```bash
ls static/images/galeria/*.webp | wc -l
ls static/images/galeria/*-800.webp | wc -l
ls static/images/galeria/*-1600.webp | wc -l
```

Els tres comptadors han de ser iguals (un per cada JPEG).

- [ ] **Step 3: Provar el lloc local amb les imatges reals**

```bash
hugo server -D
```

Obre `http://localhost:1313/ca/` i comprova:
- Hero carrega una foto en WebP (Network tab)
- Grid portada: fotos en WebP
- `/ca/galeria/`: fotos en WebP al grid, lightbox obre JPEG original
- `/ca/festivals/`: heroes i thumbnails en WebP
- `/ca/noticies/`: featured i thumbnails en WebP

- [ ] **Step 4: Commitear les imatges WebP**

```bash
git add static/images/
git commit -m "feat: imatges WebP generades (full + 800px + 1600px, q85)"
```

- [ ] **Step 5: Push i verificar deploy**

```bash
git push origin main
```

Espera que el deploy de GitHub Actions acabi (~2 min) i comprova `https://pocallum.cat` al DevTools Network.

---

## Workflow per a fotos noves (documentar a CLAUDE.md)

Afegir a la secció **Comandes útils** del `CLAUDE.md`:

```bash
# Convertir una foto nova a WebP (cal fer-ho abans de commitear)
./scripts/convert-images.sh static/images/galeria/nova-foto.jpg
```
