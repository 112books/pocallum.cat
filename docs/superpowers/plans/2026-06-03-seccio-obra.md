# Secció Obra Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a new `/obra/` section (photobooks + disc covers as Hugo individual pages), add a discrete "tira d'obra" strip on the homepage between the photo grid and services, and add `Obra` to the main navigation menu (CA + EN).

**Architecture:** New `obra` content type with individual pages per item (frontmatter-driven, no long markdown body needed). Single `/obra/` page with two anchor sections (`#fotollibres`, `#discs`). Homepage gets a new `section--tira-obra` between the photo grid and services sections. The `destacat: true` frontmatter field controls which covers appear in the homepage strip (max 4). All content created in CA + EN simultaneously.

**Tech Stack:** Hugo static site generator, Go templates, YAML frontmatter, vanilla CSS. Covers downloaded from 112books.eu and optimised as JPG/WebP. Build: `hugo --minify`. Preview: `hugo server -D`.

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `archetypes/obra.md` | Create | Template for `hugo new obra/slug.md` |
| `themes/pocallum/layouts/obra/list.html` | Create | `/obra/` page with #fotollibres and #discs sections |
| `themes/pocallum/layouts/obra/single.html` | Create | Individual obra page |
| `themes/pocallum/assets/css/main.css` | Modify | Add `.tira-obra`, `.obra-grid`, `.obra-card`, `.obra-single` styles |
| `themes/pocallum/layouts/index.html` | Modify | Add `section--tira-obra` between photo grid and services |
| `hugo.toml` | Modify | Add `Obra` / `Work` menu items (CA weight=4, EN weight=4; shift Blog/Notícies/Qui-som/Contacte to 5-8) |
| `i18n/ca.yaml` | Modify | Add obra strings |
| `i18n/en.yaml` | Modify | Add obra strings |
| `content/ca/obra/_index.md` | Create | CA obra section index |
| `content/en/obra/_index.md` | Create | EN obra section index |
| `content/ca/obra/preses-falses.md` | Create | Fotollibre CA |
| `content/en/obra/preses-falses.md` | Create | Fotollibre EN |
| `content/ca/obra/i-wanna-be-your-dog.md` | Create | Fotollibre CA |
| `content/en/obra/i-wanna-be-your-dog.md` | Create | Fotollibre EN |
| `content/ca/obra/acarrejant.md` | Create | Fotollibre CA |
| `content/en/obra/acarrejant.md` | Create | Fotollibre EN |
| `content/ca/obra/anonimos.md` | Create | Fotollibre CA |
| `content/en/obra/anonimos.md` | Create | Fotollibre EN |
| `content/ca/obra/antropoformologies.md` | Create | Fotollibre CA |
| `content/en/obra/antropoformologies.md` | Create | Fotollibre EN |
| `static/images/obra/` | Create dir | Cover images (JPG, max 600px wide) |
| `content/ca/qui-som/_index.md` | Modify | Add about link in /obra/ header (done in serveis plan if run first) |

> **Note on disc covers:** Disc content pages are created with `draft: true` until covers are located and optimised. They will not appear in production until `draft: false`.

---

## Task 1: i18n strings (CA + EN)

**Files:**
- Modify: `i18n/ca.yaml`
- Modify: `i18n/en.yaml`

- [ ] **Step 1: Add obra strings to i18n/ca.yaml**

Append at the end of `i18n/ca.yaml`:

```yaml
# Obra
obra_eyebrow:         "Obra pròpia"
obra_narrativa:       "L'obra pròpia informa la mirada amb què treballo per als altres."
obra_link_label:      "Fotollibres · Portades · Cartells"
obra_page_eyebrow:    "Obra"
obra_page_title:      "Fotollibres i portades"
obra_page_intro:      "Fotollibres publicats, portades de disc dissenyades i cartells. L'autor darrere els encàrrecs."
obra_fotollibres:     "Fotollibres"
obra_discs:           "Discs i portades"
obra_tipus_fotollibre: "Fotollibre"
obra_tipus_disc:      "Disc"
obra_available:       "Disponible a"
obra_about:           "Sobre Joan Linux Martínez"
```

- [ ] **Step 2: Add obra strings to i18n/en.yaml**

Append at the end of `i18n/en.yaml`:

```yaml
# Work / Obra
obra_eyebrow:         "Own work"
obra_narrativa:       "My own work informs the eye I bring to commissions."
obra_link_label:      "Photobooks · Covers · Posters"
obra_page_eyebrow:    "Work"
obra_page_title:      "Photobooks and covers"
obra_page_intro:      "Published photobooks, designed album covers and posters. The author behind the commissions."
obra_fotollibres:     "Photobooks"
obra_discs:           "Records and covers"
obra_tipus_fotollibre: "Photobook"
obra_tipus_disc:      "Record"
obra_available:       "Available at"
obra_about:           "About Joan Linux Martínez"
```

- [ ] **Step 3: Verify build**

```bash
hugo --minify 2>&1 | grep -iE "error|warn" | grep -v "^Total"
```

- [ ] **Step 4: Commit**

```bash
git add i18n/ca.yaml i18n/en.yaml
git commit -m "feat(i18n): afegeix strings de la secció Obra (CA + EN)"
```

---

## Task 2: Add Obra to navigation menu

**Files:**
- Modify: `hugo.toml`

- [ ] **Step 1: Insert Obra menu item in CA and EN menus**

In `hugo.toml`, find the CA menu block. Add the Obra item at weight 4 and increment Blog, Qui-som and Contacte weights by 1 (Notícies stays at 4 — wait, current: Galeria=1, Festivals=2, Serveis=3, Notícies=4, Blog=5, Qui-som=6, Contacte=7).

New order: Galeria=1, Festivals=2, Serveis=3, **Obra=4**, Notícies=5, Blog=6, Qui-som=7, Contacte=8.

Replace the CA menu section:

```toml
[[languages.ca.menus.main]]
  name   = "Galeria"
  url    = "/galeria/"
  weight = 1

[[languages.ca.menus.main]]
  name   = "Festivals"
  url    = "/festivals/"
  weight = 2

[[languages.ca.menus.main]]
  name   = "Serveis"
  url    = "/serveis/"
  weight = 3

[[languages.ca.menus.main]]
  name   = "Obra"
  url    = "/obra/"
  weight = 4

[[languages.ca.menus.main]]
  name   = "Notícies"
  url    = "/noticies/"
  weight = 5

[[languages.ca.menus.main]]
  name   = "Blog"
  url    = "/blog/"
  weight = 6

[[languages.ca.menus.main]]
  name   = "Qui som"
  url    = "/qui-som/"
  weight = 7

[[languages.ca.menus.main]]
  name   = "Contacte"
  url    = "/contacte/"
  weight = 8
  [languages.ca.menus.main.params]
    highlight = true
```

Replace the EN menu section:

```toml
[[languages.en.menus.main]]
  name   = "Gallery"
  url    = "/galeria/"
  weight = 1

[[languages.en.menus.main]]
  name   = "Festivals"
  url    = "/festivals/"
  weight = 2

[[languages.en.menus.main]]
  name   = "Services"
  url    = "/serveis/"
  weight = 3

[[languages.en.menus.main]]
  name   = "Work"
  url    = "/obra/"
  weight = 4

[[languages.en.menus.main]]
  name   = "News"
  url    = "/noticies/"
  weight = 5

[[languages.en.menus.main]]
  name   = "Blog"
  url    = "/blog/"
  weight = 6

[[languages.en.menus.main]]
  name   = "About"
  url    = "/qui-som/"
  weight = 7

[[languages.en.menus.main]]
  name   = "Contact"
  url    = "/contacte/"
  weight = 8
  [languages.en.menus.main.params]
    highlight = true
```

- [ ] **Step 2: Verify build and check nav**

```bash
hugo --minify 2>&1 | grep -iE "error|warn" | grep -v "^Total"
```

Open `hugo server -D`. Verify "Obra" (CA) and "Work" (EN) appear in the nav between Serveis and Notícies. The link will 404 until Task 4 creates the content — that's expected.

- [ ] **Step 3: Commit**

```bash
git add hugo.toml
git commit -m "feat(nav): afegeix Obra/Work al menú principal (CA + EN, weight 4)"
```

---

## Task 3: Obra archetype

**Files:**
- Create: `archetypes/obra.md`

- [ ] **Step 1: Create archetypes/obra.md**

```markdown
---
title: "{{ replace .Name "-" " " | title }}"
subtitle: ""
tipus: "fotollibre"
any: {{ now.Year }}
rol: "fotografia"
artista: ""
editorial: ""
web: ""
image: "/images/obra/{{ .Name }}.jpg"
destacat: false
date: {{ .Date }}
draft: true
---
```

- [ ] **Step 2: Commit**

```bash
git add archetypes/obra.md
git commit -m "feat(obra): archetype per a nous ítems d'obra"
```

---

## Task 4: Obra content — index pages and initial photobooks (CA + EN)

**Files:**
- Create: `content/ca/obra/_index.md`
- Create: `content/en/obra/_index.md`
- Create: `content/ca/obra/preses-falses.md` (and EN)
- Create: `content/ca/obra/i-wanna-be-your-dog.md` (and EN)
- Create: `content/ca/obra/acarrejant.md` (and EN)
- Create: `content/ca/obra/anonimos.md` (and EN)
- Create: `content/ca/obra/antropoformologies.md` (and EN)

- [ ] **Step 1: Create content/ca/obra/_index.md**

```markdown
---
title: "Obra"
description: "Fotollibres publicats, portades de disc dissenyades i cartells. L'autor darrere els encàrrecs fotogràfics."
layout: "obra"
---
```

- [ ] **Step 2: Create content/en/obra/_index.md**

```markdown
---
title: "Work"
description: "Published photobooks, designed album covers and posters. The author behind the photography commissions."
layout: "obra"
---
```

- [ ] **Step 3: Create content/ca/obra/preses-falses.md**

```markdown
---
title: "Preses Falses"
subtitle: "40 anys de Blues a Barcelona"
tipus: "fotollibre"
any: 2022
rol: "fotografia"
editorial: "112books"
web: "https://112books.eu"
image: "/images/obra/preses-falses.jpg"
destacat: true
date: 2022-01-01
draft: false
---

Quaranta anys de Blues a Barcelona documentats en un sol volum. Arxiu fotogràfic del Festival de Blues de Barcelona des dels seus inicis.
```

- [ ] **Step 4: Create content/en/obra/preses-falses.md**

```markdown
---
title: "Preses Falses"
subtitle: "40 years of Blues in Barcelona"
tipus: "fotollibre"
any: 2022
rol: "photography"
editorial: "112books"
web: "https://112books.eu"
image: "/images/obra/preses-falses.jpg"
destacat: true
date: 2022-01-01
draft: false
---

Forty years of Blues in Barcelona documented in a single volume. Photographic archive of the Barcelona Blues Festival from its beginnings.
```

- [ ] **Step 5: Create content/ca/obra/i-wanna-be-your-dog.md**

```markdown
---
title: "I Wanna Be Your Dog"
subtitle: ""
tipus: "fotollibre"
any: 2024
rol: "fotografia"
editorial: "112books"
web: "https://112books.eu"
image: "/images/obra/i-wanna-be-your-dog.jpg"
destacat: true
date: 2024-01-01
draft: false
---
```

- [ ] **Step 6: Create content/en/obra/i-wanna-be-your-dog.md**

```markdown
---
title: "I Wanna Be Your Dog"
subtitle: ""
tipus: "fotollibre"
any: 2024
rol: "photography"
editorial: "112books"
web: "https://112books.eu"
image: "/images/obra/i-wanna-be-your-dog.jpg"
destacat: true
date: 2024-01-01
draft: false
---
```

- [ ] **Step 7: Create content/ca/obra/acarrejant.md**

```markdown
---
title: "aCarrejant"
subtitle: ""
tipus: "fotollibre"
any: 2024
rol: "fotografia"
editorial: "112books"
web: "https://112books.eu"
image: "/images/obra/acarrejant.jpg"
destacat: true
date: 2024-06-01
draft: false
---
```

- [ ] **Step 8: Create content/en/obra/acarrejant.md**

```markdown
---
title: "aCarrejant"
subtitle: ""
tipus: "fotollibre"
any: 2024
rol: "photography"
editorial: "112books"
web: "https://112books.eu"
image: "/images/obra/acarrejant.jpg"
destacat: true
date: 2024-06-01
draft: false
---
```

- [ ] **Step 9: Create content/ca/obra/anonimos.md**

```markdown
---
title: "Anónimos, más allá de las apariencias"
subtitle: ""
tipus: "fotollibre"
any: 2025
rol: "fotografia i disseny"
artista: "amb Mario Ortiz"
editorial: "112books"
web: "https://112books.eu"
image: "/images/obra/anonimos.jpg"
destacat: false
date: 2025-01-01
draft: false
---
```

- [ ] **Step 10: Create content/en/obra/anonimos.md**

```markdown
---
title: "Anónimos, más allá de las apariencias"
subtitle: ""
tipus: "fotollibre"
any: 2025
rol: "photography and design"
artista: "with Mario Ortiz"
editorial: "112books"
web: "https://112books.eu"
image: "/images/obra/anonimos.jpg"
destacat: false
date: 2025-01-01
draft: false
---
```

- [ ] **Step 11: Create content/ca/obra/antropoformologies.md**

```markdown
---
title: "Antropoformologies"
subtitle: "Sèrie de 3 volums — dansa"
tipus: "fotollibre"
any: 2026
rol: "fotografia"
editorial: "112books"
web: "https://112books.eu"
image: "/images/obra/antropoformologies.jpg"
destacat: false
date: 2026-01-01
draft: false
---
```

- [ ] **Step 12: Create content/en/obra/antropoformologies.md**

```markdown
---
title: "Antropoformologies"
subtitle: "3-volume series — dance"
tipus: "fotollibre"
any: 2026
rol: "photography"
editorial: "112books"
web: "https://112books.eu"
image: "/images/obra/antropoformologies.jpg"
destacat: false
date: 2026-01-01
draft: false
---
```

- [ ] **Step 13: Obtain and place cover images**

Download covers from 112books.eu. Optimise each to max 600px wide, save as JPG to `static/images/obra/`:

```
static/images/obra/preses-falses.jpg
static/images/obra/i-wanna-be-your-dog.jpg
static/images/obra/acarrejant.jpg
static/images/obra/anonimos.jpg
static/images/obra/antropoformologies.jpg
```

If a cover is not yet available, create a 600×600 black placeholder and set `draft: true` on that obra page until the real cover is ready.

- [ ] **Step 14: Verify build**

```bash
hugo --minify 2>&1 | grep -iE "error|warn" | grep -v "^Total"
```

- [ ] **Step 15: Commit**

```bash
git add content/ca/obra/ content/en/obra/ static/images/obra/ archetypes/obra.md
git commit -m "feat(obra): pàgines inicials fotollibres CA + EN (Preses Falses, IWBYD, aCarrejant, Anónimos, Antropoformologies)"
```

---

## Task 5: Obra layouts — list.html and single.html

**Files:**
- Create: `themes/pocallum/layouts/obra/list.html`
- Create: `themes/pocallum/layouts/obra/single.html`

- [ ] **Step 1: Create themes/pocallum/layouts/obra/list.html**

```html
{{ define "main" }}
{{ $lang := site.Language.Lang }}
{{ $all := where .Site.RegularPages "Type" "obra" }}
{{ $fotollibres := where $all ".Params.tipus" "fotollibre" | sort "Params.any" "desc" }}
{{ $discs := where $all ".Params.tipus" "disc" | sort "Params.any" "desc" }}

<section class="page-header">
  <div class="container">
    <p class="page-eyebrow">{{ i18n "obra_page_eyebrow" }}</p>
    <h1 class="page-title">{{ i18n "obra_page_title" }}</h1>
    <p class="page-intro">{{ i18n "obra_page_intro" }}</p>
    <p class="obra-about-link">
      <a href="https://about.pocallum.cat" target="_blank" rel="noopener noreferrer">
        {{ i18n "obra_about" }} →
      </a>
    </p>
  </div>
</section>

{{ if $fotollibres }}
<section class="section section--obra" id="fotollibres">
  <div class="container">
    <h2 class="obra-section-title">{{ i18n "obra_fotollibres" }}</h2>
    <div class="obra-grid obra-grid--fotollibres">
      {{ range $fotollibres }}
      <a href="{{ .RelPermalink }}" class="obra-card">
        {{ with .Params.image }}
        <img src="{{ . }}" alt="{{ $.Title }}" class="obra-card__cover" loading="lazy">
        {{ end }}
        <p class="obra-card__title">{{ .Title }}</p>
        {{ with .Params.subtitle }}<p class="obra-card__subtitle">{{ . }}</p>{{ end }}
        <p class="obra-card__meta">{{ .Params.any }}{{ with .Params.editorial }} · {{ . }}{{ end }}</p>
      </a>
      {{ end }}
    </div>
  </div>
</section>
{{ end }}

{{ if $discs }}
<section class="section section--obra section--alt" id="discs">
  <div class="container">
    <h2 class="obra-section-title">{{ i18n "obra_discs" }}</h2>
    <div class="obra-grid obra-grid--discs">
      {{ range $discs }}
      <a href="{{ .RelPermalink }}" class="obra-card">
        {{ with .Params.image }}
        <img src="{{ . }}" alt="{{ $.Title }}" class="obra-card__cover" loading="lazy">
        {{ end }}
        <p class="obra-card__title">{{ .Title }}</p>
        {{ with .Params.artista }}<p class="obra-card__subtitle">{{ . }}</p>{{ end }}
        <p class="obra-card__meta">{{ .Params.any }}{{ with .Params.rol }} · {{ . }}{{ end }}</p>
      </a>
      {{ end }}
    </div>
  </div>
</section>
{{ end }}

{{ end }}
```

- [ ] **Step 2: Create themes/pocallum/layouts/obra/single.html**

```html
{{ define "main" }}
{{ $lang := site.Language.Lang }}

<article class="obra-single-wrap">
  <div class="container">
    <div class="obra-single">
      <div class="obra-single__visual">
        {{ with .Params.image }}
        <img src="{{ . }}" alt="{{ $.Title }}" class="obra-single__cover">
        {{ end }}
      </div>
      <div class="obra-single__info">
        <p class="obra-single__type">
          {{ if eq .Params.tipus "fotollibre" }}{{ i18n "obra_tipus_fotollibre" }}{{ else }}{{ i18n "obra_tipus_disc" }}{{ end }}
          · {{ .Params.any }}
        </p>
        <h1 class="obra-single__title">{{ .Title }}</h1>
        {{ with .Params.subtitle }}<p class="obra-single__subtitle">{{ . }}</p>{{ end }}
        {{ with .Params.artista }}<p class="obra-single__artista">{{ . }}</p>{{ end }}
        <p class="obra-single__rol">{{ .Params.rol }}</p>
        {{ with .Params.editorial }}<p class="obra-single__editorial">{{ . }}</p>{{ end }}
        {{ with .Content }}<div class="obra-single__desc prose">{{ . }}</div>{{ end }}
        {{ with .Params.web }}
        <a href="{{ . }}" class="obra-single__link btn btn--ghost" target="_blank" rel="noopener noreferrer">
          {{ i18n "obra_available" }} {{ $.Params.editorial | default "web" }} →
        </a>
        {{ end }}
      </div>
    </div>
    <div class="obra-single__back">
      <a href="{{ "obra/" | relLangURL }}">← {{ i18n "obra_page_eyebrow" }}</a>
    </div>
  </div>
</article>

{{ end }}
```

- [ ] **Step 3: Verify build — /obra/ and individual pages render**

```bash
hugo --minify 2>&1 | grep -iE "error|warn" | grep -v "^Total"
```

Open `hugo server -D` and verify:
- `/obra/` lists fotollibres in a grid
- `/obra/preses-falses/` renders the single page correctly
- EN versions work at `/en/obra/` and `/en/obra/preses-falses/`

- [ ] **Step 4: Commit**

```bash
git add themes/pocallum/layouts/obra/
git commit -m "feat(obra): layouts list.html i single.html per a la secció /obra/"
```

---

## Task 6: CSS for obra section

**Files:**
- Modify: `themes/pocallum/assets/css/main.css`

- [ ] **Step 1: Append obra CSS to main.css**

Add at the end of `themes/pocallum/assets/css/main.css`:

```css
/* ── Obra ──────────────────────────────────────────────────── */

.obra-about-link {
  margin-top: var(--sp-3);
  font-size: .875rem;
}
.obra-about-link a { color: var(--mid); }
.obra-about-link a:hover { color: var(--accent); }

.obra-section-title {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: .12em;
  color: var(--mid);
  margin: 0 0 var(--sp-5);
  padding-bottom: var(--sp-2);
  border-bottom: 1px solid var(--line);
}

.obra-grid {
  display: grid;
  gap: var(--sp-4);
  grid-template-columns: repeat(3, 1fr);
}
.obra-grid--discs {
  grid-template-columns: repeat(4, 1fr);
}
@media (max-width: 768px) {
  .obra-grid { grid-template-columns: repeat(2, 1fr); }
  .obra-grid--discs { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .obra-grid { grid-template-columns: 1fr; }
  .obra-grid--discs { grid-template-columns: repeat(2, 1fr); }
}

.obra-card {
  display: block;
  text-decoration: none;
  color: var(--fg);
  background: var(--bg2);
  padding: var(--sp-3);
  transition: background .15s;
}
.obra-card:hover { background: #181818; }
.obra-card__cover {
  width: 100%;
  aspect-ratio: auto;
  display: block;
  margin-bottom: var(--sp-2);
}
.obra-card__title {
  font-size: .9375rem;
  font-weight: 600;
  margin: 0 0 .15rem;
}
.obra-card__subtitle {
  font-size: .8125rem;
  color: var(--mid);
  margin: 0 0 .15rem;
}
.obra-card__meta {
  font-size: .8125rem;
  color: var(--mid);
  margin: 0;
}

/* Obra single */
.obra-single-wrap { padding: var(--sp-8) 0; }
.obra-single {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: var(--sp-8);
  align-items: start;
}
@media (max-width: 640px) {
  .obra-single { grid-template-columns: 1fr; }
}
.obra-single__cover {
  width: 100%;
  display: block;
  box-shadow: 0 4px 24px rgba(0,0,0,.5);
}
.obra-single__type {
  font-size: .75rem;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: var(--mid);
  margin: 0 0 var(--sp-2);
}
.obra-single__title {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  margin: 0 0 var(--sp-1);
  line-height: 1.1;
}
.obra-single__subtitle,
.obra-single__artista {
  color: var(--mid);
  margin: 0 0 var(--sp-1);
}
.obra-single__rol,
.obra-single__editorial {
  font-size: .875rem;
  color: var(--mid);
  margin: 0 0 var(--sp-1);
}
.obra-single__desc { margin: var(--sp-4) 0; }
.obra-single__link { display: inline-block; margin-top: var(--sp-3); }
.obra-single__back {
  margin-top: var(--sp-8);
  font-size: .875rem;
}
.obra-single__back a { color: var(--mid); text-decoration: none; }
.obra-single__back a:hover { color: var(--accent); }

/* ── Tira d'obra — portada ──────────────────────────────────── */
.tira-obra {
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding: var(--sp-3) 0;
}
.tira-obra__inner {
  display: flex;
  align-items: center;
  gap: var(--sp-5);
}
.tira-obra__covers {
  display: flex;
  gap: var(--sp-2);
  flex-shrink: 0;
}
.tira-obra__cover {
  width: 52px;
  height: 52px;
  object-fit: cover;
  display: block;
}
.tira-obra__text {
  flex: 1;
  min-width: 0;
}
.tira-obra__quote {
  font-size: .8125rem;
  color: var(--mid);
  font-style: italic;
  margin: 0 0 .2rem;
  line-height: 1.4;
}
.tira-obra__link {
  font-size: .8125rem;
  color: var(--accent);
  text-decoration: none;
  white-space: nowrap;
}
.tira-obra__link:hover { text-decoration: underline; }
@media (max-width: 480px) {
  .tira-obra__covers { display: none; }
}
```

- [ ] **Step 2: Verify build and visual check**

```bash
hugo --minify 2>&1 | grep -iE "error|warn" | grep -v "^Total"
```

Open `hugo server -D` and check `/obra/`: grid renders correctly, cover images display, mobile layout works.

- [ ] **Step 3: Commit**

```bash
git add themes/pocallum/assets/css/main.css
git commit -m "feat(css): estils per a .obra-grid, .obra-card, .obra-single, .tira-obra"
```

---

## Task 7: Homepage tira d'obra

**Files:**
- Modify: `themes/pocallum/layouts/index.html`

The tira d'obra goes between the photo grid section and the serveis section.

- [ ] **Step 1: Add tira d'obra section to index.html**

In `themes/pocallum/layouts/index.html`, find the comment `{{/* ── Serveis — resum */}}` and insert the following block immediately before it:

```html
{{/* ── Tira d'obra ───────────────────────────────────────────────────────── */}}
{{ $destacats := where (where .Site.RegularPages "Type" "obra") ".Params.destacat" true | first 4 }}
{{ if $destacats }}
<div class="tira-obra">
  <div class="container">
    <div class="tira-obra__inner">
      <div class="tira-obra__covers">
        {{ range $destacats }}
        {{ with .Params.image }}
        <img src="{{ . }}" alt="" class="tira-obra__cover" loading="lazy" aria-hidden="true">
        {{ end }}
        {{ end }}
      </div>
      <div class="tira-obra__text">
        <p class="tira-obra__quote">{{ i18n "obra_narrativa" }}</p>
        <a href="{{ "obra/" | relLangURL }}" class="tira-obra__link">
          {{ i18n "obra_link_label" }} →
        </a>
      </div>
    </div>
  </div>
</div>
{{ end }}

```

- [ ] **Step 2: Verify the section renders on homepage**

```bash
hugo --minify 2>&1 | grep -iE "error|warn" | grep -v "^Total"
```

Open `hugo server -D` and check the homepage:
- Tira appears between the photo grid and the services section
- 4 covers show (those with `destacat: true`)
- Quote text in italics, link to /obra/ in accent colour
- EN homepage shows EN strings

- [ ] **Step 3: Commit**

```bash
git add themes/pocallum/layouts/index.html
git commit -m "feat(portada): tira d'obra discreta entre galeria i serveis"
```

---

## Task 8: Final verification and push

- [ ] **Step 1: Full build check**

```bash
hugo --minify 2>&1 | grep -iE "error|warn" | grep -v "^Total"
```

Expected: no output.

- [ ] **Step 2: Manual checklist**

Open `hugo server -D` and verify all of the following:

**CA:**
- [ ] Portada: tira d'obra visible entre fotos i serveis, 4 cobertes, quote en cursiva
- [ ] `/obra/`: secció amb fotollibres en grid de 3 columnes
- [ ] `/obra/preses-falses/`: pàgina individual renderitzada amb coberta, metadades i link a 112books
- [ ] Menú: "Obra" apareix entre "Serveis" i "Notícies"

**EN:**
- [ ] Homepage: tira d'obra amb strings en anglès ("My own work informs...")
- [ ] `/en/obra/`: "Photobooks" heading, grid correcte
- [ ] `/en/obra/preses-falses/`: pàgina individual en anglès
- [ ] Menu: "Work" appears between "Services" and "News"

**Mobile (resize to 375px):**
- [ ] Tira d'obra: cobertes ocultes (display:none), text i link visibles
- [ ] `/obra/`: grid de 2 columnes

- [ ] **Step 3: Push to production**

```bash
git push origin main
```
