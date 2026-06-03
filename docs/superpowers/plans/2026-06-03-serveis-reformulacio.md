# Serveis Reformulació Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 5 discipline-based service chapters with 3 client-oriented blocks (músics/bandes, festivals/sales, projectes editorials), including an embedded message for emerging musicians and a link to about.pocallum.cat from qui-som.

**Architecture:** Restructure `data/serveis.yaml` to 3 groups with a `cita` field on bloc 01. Update `themes/pocallum/layouts/serveis/list.html` to render the new structure. Update i18n strings and content files. No new templates or CSS needed — the existing `.servei-chapter` layout is reused with one new element for the cita quote.

**Tech Stack:** Hugo static site generator, YAML data, Go templates, i18n yaml files. Build with `hugo --minify`. Preview with `hugo server -D`.

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `data/serveis.yaml` | Modify | Restructure to 3 client groups + add `cita`/`cita_en` fields |
| `themes/pocallum/layouts/serveis/list.html` | Modify | Render 3 blocks with cita quote + new CTA text |
| `content/ca/serveis/_index.md` | Modify | Update intro text |
| `content/en/serveis/_index.md` | Modify | Update intro text |
| `content/ca/qui-som/_index.md` | Modify | Add about.pocallum.cat link at end of L'ecosistema section |
| `content/en/qui-som/_index.md` | Modify | Add about.pocallum.cat link at end of ecosystem section |
| `i18n/ca.yaml` | Modify | Add `serveis_chapter_cta_full` key |
| `i18n/en.yaml` | Modify | Add `serveis_chapter_cta_full` key |

> **Nota:** El nou `data/serveis.yaml` no inclou el camp `image:` per grup. La plantilla usa `{{ with $grup.image }}` per a la foto de cada capítol, de manera que si no hi ha imatge simplement no renderitza res. Comportament intencionat — les fotos de secció de l'estructura antiga desapareixen.

---

## Task 1: Restructure data/serveis.yaml

**Files:**
- Modify: `data/serveis.yaml`

- [ ] **Step 1: Replace the entire contents of data/serveis.yaml**

```yaml
grups:

  - nom:    "Per a músics i bandes"
    nom_en: "For musicians and bands"
    desc:    "Sessions de directe, material de premsa, portades de disc, contingut per a xarxes. Sabem el que necessiteu perquè ho hem fet des dels dos costats de l'escenari."
    desc_en: "Live sessions, press material, album covers, social content. We know what you need because we've done it from both sides of the stage."
    cita:    "Treballem amb quartets que debuten i amb festivals de deu anys d'història. El criteri editorial és el mateix. El pressupost, no."
    cita_en: "We work with quartets just starting out and with ten-year festivals. The editorial standard is the same. The budget is not."
    items:
      - nom:    "Directe i concerts"
        nom_en: "Live and concerts"
        desc:    "Jazz, blues, flamenc, punk, folk, clàssica — qualsevol cosa que soni de debò i en directe. L'energia de l'escenari i l'ambient de la sala: el que passa a l'escena i el que passa entre el públic."
        desc_en: "Jazz, blues, flamenco, punk, folk, classical — anything that sounds real and live. Stage energy and room atmosphere: what happens on stage and between the audience."
      - nom:    "Sessió de banda o artista"
        nom_en: "Band or artist session"
        desc:    "Portades de disc, material de premsa, contingut per a xarxes. Sessions pensades per a l'ús específic que necessites, no per a l'estoc."
        desc_en: "Album covers, press material, social content. Sessions designed for the specific use you need, not for stock."
      - nom:    "Portada de disc"
        nom_en: "Album cover"
        desc:    "Fotografia i/o disseny gràfic. Des del concepte fins al fitxer final, amb criteri editorial."
        desc_en: "Photography and/or graphic design. From concept to final file, with editorial judgement."

  - nom:    "Per a festivals i sales"
    nom_en: "For festivals and venues"
    desc:    "Cobertura completa d'event, acreditació, arxiu fotogràfic. Entenem la dinàmica d'un festival: l'estructura, els imprevistos, els moments que no surten al programa."
    desc_en: "Full event coverage, accreditation, photo archive. We understand festival dynamics: the structure, the surprises, the moments not in the programme."
    items:
      - nom:    "Cobertura de festival"
        nom_en: "Festival coverage"
        desc:    "Un dia o edició completa. Concerts, ambient, backstage, públic. Lliurament en 48 hores. Hem treballat a festivals íntims de vint persones i a events de milers."
        desc_en: "One day or full edition. Concerts, atmosphere, backstage, audience. Delivery in 48 hours. We've worked at intimate festivals of twenty people and events of thousands."
      - nom:    "Arts escèniques i teatre"
        nom_en: "Performing arts and theatre"
        desc:    "Dansa, teatre, circ, performance. Press kits, books de companyia, imatge per a programadors i agents. Fotografiem assajos i funcions. Sabem quan disparar sense molestar."
        desc_en: "Dance, theatre, circus, performance. Press kits, company books, images for programmers and agents. We photograph rehearsals and shows. We know when to shoot without disturbing."
      - nom:    "Arxiu i documentació"
        nom_en: "Archive and documentation"
        desc:    "Cobertures reutilitzables per a memòries anuals, premsa i xarxes socials. Una inversió que dura més que una edició."
        desc_en: "Reusable coverage for annual reports, press and social media. An investment that outlasts a single edition."

  - nom:    "Per a projectes editorials"
    nom_en: "For editorial projects"
    desc:    "Fotollibres, portades, edició gràfica. En sinergia amb 112books.eu — editorial independent de fotobooks. Del concert al llibre, del disc a l'objecte."
    desc_en: "Photobooks, covers, graphic editing. In synergy with 112books.eu — independent photobook publisher. From concert to book, from record to object."
    items:
      - nom:    "Fotollibre"
        nom_en: "Photobook"
        desc:    "Des de la idea fins al producte final: concepte, edició d'imatges, disseny, impressió, distribució. Acompanyament en totes les etapes."
        desc_en: "From idea to final product: concept, image editing, design, printing, distribution. Support at every stage."
      - nom:    "Portada i identitat visual"
        nom_en: "Cover and visual identity"
        desc:    "Portades de disc, de llibre, cartells de concert. Fotografia i/o disseny gràfic amb criteri editorial propi."
        desc_en: "Album covers, book covers, concert posters. Photography and/or graphic design with an editorial eye."
      - nom:    "Edicions limitades col·leccionables"
        nom_en: "Limited collector's editions"
        desc:    "Tirades curtes, materials seleccionats, objectes que val la pena tenir. El col·leccionista de vinil i el de fotografia analògica són la mateixa persona."
        desc_en: "Short runs, selected materials, objects worth owning. The vinyl collector and the analogue photography collector are the same person."
```

- [ ] **Step 2: Verify Hugo build has no errors**

```bash
hugo --minify 2>&1 | grep -iE "error|warn" | grep -v "^Total"
```

Expected: no output (no errors or warnings).

- [ ] **Step 3: Commit**

```bash
git add data/serveis.yaml
git commit -m "feat(serveis): restructura en 3 blocs per client (músics, festivals, editorials)"
```

---

## Task 2: Update serveis layout — render cita + new CTA

**Files:**
- Modify: `themes/pocallum/layouts/serveis/list.html`

The current layout iterates over groups and renders items. We need to add rendering of the optional `cita`/`cita_en` field as a blockquote between the items list and the CTA.

- [ ] **Step 1: Replace themes/pocallum/layouts/serveis/list.html**

```html
{{ define "main" }}
{{ $serveis := hugo.Data.serveis }}
{{ $lang := site.Language.Lang }}

<section class="page-header">
  <div class="container">
    <p class="page-eyebrow">{{ i18n "serveis_eyebrow" | default "El que fem" }}</p>
    <h1 class="page-title">{{ i18n "serveis_title" | default "Serveis fotogràfics" }}</h1>
    <p class="page-intro">{{ i18n "serveis_intro" | default "No treballem amb tarifes tancades. Cada projecte és diferent i mereix un pressupost fet a mida." }}</p>
  </div>
</section>

{{ if $serveis }}
{{ range $i, $grup := $serveis.grups }}
<section class="servei-chapter{{ if mod $i 2 }} servei-chapter--alt{{ end }}" id="servei-{{ add $i 1 }}">
  <div class="container">
    <div class="servei-chapter__head">
      <span class="servei-chapter__num">{{ printf "%02d" (add $i 1) }}</span>
      <h2 class="servei-chapter__title">
        {{ if eq $lang "en" }}{{ $grup.nom_en }}{{ else }}{{ $grup.nom }}{{ end }}
      </h2>
      <p class="servei-chapter__desc">
        {{ if eq $lang "en" }}{{ $grup.desc_en }}{{ else }}{{ $grup.desc }}{{ end }}
      </p>
    </div>
    <ul class="servei-chapter__list">
      {{ range $grup.items }}
      <li class="servei-chapter__item">
        <span class="servei-chapter__item-title">
          {{ if eq $lang "en" }}{{ .nom_en }}{{ else }}{{ .nom }}{{ end }}
        </span>
        <span class="servei-chapter__item-desc">
          {{ if eq $lang "en" }}{{ .desc_en }}{{ else }}{{ .desc }}{{ end }}
        </span>
      </li>
      {{ end }}
    </ul>
    {{ $cita := cond (eq $lang "en") $grup.cita_en $grup.cita }}
    {{ with $cita }}
    <blockquote class="servei-chapter__cita">{{ . }}</blockquote>
    {{ end }}
  </div>
  {{ with $grup.image }}
  <div class="servei-chapter__photo-wrap">
    <img src="{{ . | strings.TrimLeft "/" | relURL }}" alt="" class="servei-chapter__photo" loading="lazy">
  </div>
  {{ end }}
  <div class="container">
    <div class="servei-chapter__cta-bar">
      <a href="{{ "contacte/" | relLangURL }}" class="servei-chapter__cta-link">
        {{ i18n "serveis_chapter_cta" | default "Parlem-ne →" }}
      </a>
    </div>
  </div>
</section>
{{ end }}
{{ end }}

{{ with .Content }}
<section class="section section--serveis-faq">
  <div class="container container--narrow">
    <div class="prose">{{ . }}</div>
  </div>
</section>
{{ end }}

<section class="section--serveis-final-cta">
  <div class="container container--narrow">
    <p class="serveis-final-cta__pre">{{ i18n "serveis_final_pre" | default "Cada projecte és diferent." }}</p>
    <h2 class="serveis-final-cta__title">{{ i18n "serveis_final_title" | default "Explica'ns el teu i ho fem possible." }}</h2>
    <a href="{{ "contacte/" | relLangURL }}" class="btn btn--primary btn--lg">
      {{ i18n "cta_contact" | default "Demana pressupost" }}
    </a>
  </div>
</section>

{{ end }}
```

- [ ] **Step 2: Add CSS for .servei-chapter__cita in main.css**

Find the `.servei-chapter__cta-bar` block in `themes/pocallum/assets/css/main.css` and add the cita style just before it:

```css
.servei-chapter__cita {
  border-left: 2px solid var(--accent);
  margin: var(--sp-5) 0 0;
  padding: var(--sp-3) var(--sp-4);
  font-style: italic;
  color: var(--mid);
  font-size: .9375rem;
}
```

- [ ] **Step 3: Verify build and preview**

```bash
hugo --minify 2>&1 | grep -iE "error|warn" | grep -v "^Total"
```

Open `hugo server -D` and check `/serveis/` in browser:
- 3 sections numbered 01, 02, 03
- Blockquote appears only in section 01 (músics)
- No blockquote in sections 02 and 03

- [ ] **Step 4: Commit**

```bash
git add themes/pocallum/layouts/serveis/list.html themes/pocallum/assets/css/main.css
git commit -m "feat(serveis): layout 3 blocs per client amb cita músics emergents"
```

---

## Task 3: Update serveis content files (CA + EN)

**Files:**
- Modify: `content/ca/serveis/_index.md`
- Modify: `content/en/serveis/_index.md`

- [ ] **Step 1: Replace content/ca/serveis/_index.md**

```markdown
---
title: "Serveis fotogràfics"
description: "Fotografia de cultura per a músics, bandes, festivals i projectes editorials. Pressupost a mida, sense tarifes tancades."
---

## Quin tipus de projectes documenta Pocallum?

Concerts de jazz, blues, flamenc, indie i música del món; teatre, dansa contemporània, circ i performance; festivals culturals i mostres; fotollibres i portades de disc. Des del 2002 documentem el moment irrepetible del directe a Barcelona i Catalunya. No fem fotografia de producte, gastronomia ni esdeveniments corporatius genèrics.

## Fa Pocallum fotografia analògica o digital?

Les dues, depenent del projecte. L'analògic és el punt de partida: pel·lícula de 35mm, format mig i gran format fins a 10×8". El digital s'utilitza quan la llum és molt limitada, el ritme de lliurament és urgent o el volum ho requereix. Mai per comoditat. El laboratori és a la Nau Bostik, al barri de la Segrera.

## Com és el procés per demanar pressupost?

No treballem amb tarifes tancades perquè cada projecte és diferent. El procés és: expliqueu-nos el projecte per correu (hola@pocallum.cat) o via el formulari de contacte; en 48 hores enviem una proposta personalitzada. Si hi ha encaix, comencem. Si no, us ho diem clar.

## Treballa Pocallum fora de Barcelona?

Sí. La base és Barcelona i Catalunya, però treballem arreu quan el projecte ho val. Hem documentat festivals i produccions a Madrid, Andalusia, el País Valencià i l'estranger. Els desplaçaments s'inclouen al pressupost.
```

- [ ] **Step 2: Replace content/en/serveis/_index.md**

```markdown
---
title: "Photography services"
description: "Cultural photography for musicians, bands, festivals and editorial projects. Custom quotes, no fixed rates."
---

## What kind of projects does Pocallum document?

Jazz, blues, flamenco, indie and world music concerts; contemporary dance, theatre, circus and performance; cultural festivals and showcases; photobooks and album covers. Since 2002 we've documented the unrepeatable moments of live performance in Barcelona and Catalonia. We don't do product photography, food photography or generic corporate events.

## Does Pocallum shoot analogue or digital?

Both, depending on the project. Analogue is the starting point: 35mm film, medium format and large format up to 10×8". Digital when light is very limited, delivery is urgent or volume requires it. Never out of convenience. The darkroom is at Nau Bostik, in the Segrera neighbourhood.

## How does the quote process work?

We don't work with fixed rates because every project is different. The process: tell us about the project by email (hola@pocallum.cat) or via the contact form; we send a personalised proposal within 48 hours. If there's a fit, we begin. If not, we say so clearly.

## Does Pocallum work outside Barcelona?

Yes. Our base is Barcelona and Catalonia, but we travel when the project is worth it. We've documented festivals and productions in Madrid, Andalusia, Valencia and abroad. Travel is included in the quote.
```

- [ ] **Step 3: Verify build**

```bash
hugo --minify 2>&1 | grep -iE "error|warn" | grep -v "^Total"
```

- [ ] **Step 4: Commit**

```bash
git add content/ca/serveis/_index.md content/en/serveis/_index.md
git commit -m "content(serveis): actualitza intro i FAQ per als 3 nous blocs de client"
```

---

## Task 4: Add about.pocallum.cat link to qui-som (CA + EN)

**Files:**
- Modify: `content/ca/qui-som/_index.md`
- Modify: `content/en/qui-som/_index.md`

- [ ] **Step 1: Add link to CA qui-som — at the end of the L'ecosistema section**

Find the line `**[LinuxBCN](https://linuxbcn.com)** — Consultoria tecnològica i programari lliure.` and add after the closing `---`:

```markdown
La trajectòria completa com a autor, a [about.pocallum.cat →](https://about.pocallum.cat)
```

The end of the L'ecosistema section in `content/ca/qui-som/_index.md` should look like:

```markdown
**[LinuxBCN](https://linuxbcn.com)** — Consultoria tecnològica i programari lliure.

La trajectòria completa com a autor, a [about.pocallum.cat →](https://about.pocallum.cat)

---
```

- [ ] **Step 2: Add link to EN qui-som — at the end of the ecosystem section**

Find `**[LinuxBCN](https://linuxbcn.com)** — Technology consultancy and free software.` and add:

```markdown
**[LinuxBCN](https://linuxbcn.com)** — Technology consultancy and free software.

Full biography and author trajectory at [about.pocallum.cat →](https://about.pocallum.cat)

---
```

- [ ] **Step 3: Verify build and check the page**

```bash
hugo --minify 2>&1 | grep -iE "error|warn" | grep -v "^Total"
```

Open `hugo server -D` and visit `/qui-som/` (CA and EN). Verify the link appears after the LinuxBCN entry.

- [ ] **Step 4: Commit and push**

```bash
git add content/ca/qui-som/_index.md content/en/qui-som/_index.md
git commit -m "feat(qui-som): afegeix link a about.pocallum.cat (CA + EN)"
git push origin main
```

---

## Verification Checklist

After all tasks:

- [ ] `/serveis/` (CA): shows 3 sections — "Per a músics i bandes", "Per a festivals i sales", "Per a projectes editorials"
- [ ] `/serveis/` (CA): section 01 has the blockquote cita; sections 02 and 03 do not
- [ ] `/serveis/` (EN): shows "For musicians and bands", "For festivals and venues", "For editorial projects"
- [ ] `/serveis/` (EN): section 01 has English cita; sections 02 and 03 do not
- [ ] Portada (CA + EN): serveis preview shows 3 rows instead of 5
- [ ] `/qui-som/` (CA): link to about.pocallum.cat after L'ecosistema section
- [ ] `/qui-som/` (EN): link to about.pocallum.cat after ecosystem section
- [ ] `hugo --minify` produces zero errors
