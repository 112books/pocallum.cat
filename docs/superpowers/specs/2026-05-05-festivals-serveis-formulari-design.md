# Design: Festivals, Serveis (copy) i Formulari wizard
**Data:** 2026-05-05
**Estat:** Aprovat — pendent d'implementació

---

## 1. Secció Festivals

### Arquitectura
- **Content type:** `festivals` (igual que `noticies`)
- **URL:** `/festivals/` (CA), `/en/festivals/` (EN)
- **Menú:** apareix al menú principal entre Galeria i Serveis

### Frontmatter per festival
```yaml
---
title: "VijazZ Festival"
slug: "vijazz"
date: 2025-01-01          # data del darrer any treballat (per ordenació)
anys: "2019 – 2025"       # rang visible al web
lloc: "Vic"
disciplina: "Jazz"
web: "https://vijazz.cat" # opcional
image: "/images/festivals/vijazz.jpg"
draft: false
---
Cos en Markdown: context del festival, anècdota, relació amb Pocallum.
```

### Plantilles
- `layouts/festivals/list.html` — graella de targetes (foto + nom + anys + lloc + disciplina)
- `layouts/festivals/single.html` — foto gran + text + dades + galeria de fotos referenciades al Markdown

### Imatges
- Foto destacada per targeta: `static/images/festivals/NOM-FESTIVAL.jpg`
- Fotos de galeria dins cada pàgina: referenciades des del cos Markdown amb Markdown o shortcode

### Festivals inicials (5 fitxers)
| Slug | Nom | Disciplina | Lloc |
|------|-----|-----------|------|
| `vijazz` | VijazZ Festival | Jazz | Vic |
| `festival-blues-barcelona` | Festival de Blues de Barcelona | Blues | Barcelona |
| `arundo-donax` | Arundo Donax | Música experimental | Barcelona |
| `im-jazz` | I'm Jazz | Jazz | Barcelona |
| `flamenco-de-barrio` | Flamenco de Barrio | Flamenc | Barcelona |

### Archetype (`archetypes/festivals.md`)
```yaml
---
title: ""
date: {{ .Date }}
anys: ""
lloc: ""
disciplina: ""
web: ""
image: "/images/festivals/"
draft: true
---
```

---

## 2. Copy dels serveis (serveis.yaml)

Veu: propera, directa, punyent. Res de corporatiu.

### Grup Cultura
**Intro:** "Portem quinze anys al fossat, a la platea i als camerinos. Sabem el que passa quan s'apaguen els llums."

| Servei | Copy CA |
|--------|---------|
| Concerts i events musicals | "No fotografiem concerts. Fotografiem el que passa entre dues notes. L'energia que no surt al programa de mà." |
| Grups musicals i artistes | "Sessions per a músics que necessiten imatges que soïn. Per a premsa, xarxes, portades i tot el que ve al darrere d'un disc." |
| Arts escèniques | "Teatre, dansa, circ, performance. Coneixem el ritme de l'escena i sabem quan disparar sense trencar res." |

### Grup Artistes
**Intro:** "Una bona foto no és la que et deixa bé. És la que et deixa veritat."

| Servei | Copy CA |
|--------|---------|
| Book actoral | "El book que necessiten casting directors, agents i programadors. Sèries en estudi i en localització. Entenem l'àmbit teatral i audiovisual perquè hi treballem." |
| Book artístic | "Per a músics, balladores, performers, il·lustradors. Un book que parla de qui ets, no de com sembla que hauràs de ser." |
| Foto de perfil professional | "Una sola imatge que representi qui ets. Directa, natural, sense filtres de fira. Per a la teva web, la teva premsa, el teu LinkedIn." |

### Grup Empreses
**Intro:** "Les empreses que entenen la cultura necessiten imatges que ho demostrin."

| Servei | Copy CA |
|--------|---------|
| Equip i instal·lacions | "La gent que fa possible el vostre projecte mereix ser fotografiada amb dignitat. No amb somriures forçats i fons de cortina." |
| Fotografies per a xarxes socials | "Contingut visual consistent per a Instagram i LinkedIn. Sessions periòdiques perquè la vostra presència digital respiri." |

### CTA final pàgina serveis
> "Cada projecte és diferent. Explica'ns el teu i et fem un pressupost a mida, sense embuts."

---

## 3. Formulari wizard de pressupost (Tally.so)

Estructura en 4 passos. El formulari es crea a Tally.so i s'integra via iframe existent.

### Pas 1 — Qui ets
- Nom i cognoms *(obligatori)*
- Email *(obligatori)*
- Telèfon *(opcional)*
- Empresa o organització *(opcional — placeholder: "Si represents una entitat, festival o empresa")*

### Pas 2 — Quin servei necessites
Selecció única (radio visual):
- Concert o event musical
- Arts escèniques (teatre, dansa, circ)
- Sessió per a grup o artista musical
- Book actoral
- Book artístic
- Foto de perfil professional
- Fotografia d'empresa (equip / instal·lacions)
- Contingut per a xarxes socials
- Encara no ho tinc clar

### Pas 3 — Quan i on
- Data o rang de dates *(text lliure — placeholder: "Ex: 15 de juny, o durant el mes de setembre")*
- Lloc aproximat *(text lliure — placeholder: "Barcelona, Vic, en remot…")*

### Pas 4 — Explica'ns el projecte
- Camp de text llarg *(placeholder: "Quant més ens expliques, millor podrem ajustar el pressupost. No cal que sigui perfecte.")*
- Com ens has conegut *(desplegable: xarxes socials / recomanació / cercador / festival / altres)*

### Missatge de confirmació
> "Rebut. T'escrivim en 48 hores amb el pressupost. Si tens pressa, truca'ns directament."

### Nota d'implementació
El formulari es crea manualment a tally.so. Un cop creat, afegir l'ID al `hugo.toml`:
```toml
[params]
  tallyFormContact = "ID_DEL_FORMULARI"
```

---

## Tasques d'implementació

### Festivals
- [ ] Crear `archetypes/festivals.md`
- [ ] Crear `layouts/festivals/list.html`
- [ ] Crear `layouts/festivals/single.html`
- [ ] Afegir CSS per targetes de festival i pàgina single
- [ ] Crear 5 fitxers de contingut (vijazz, blues-bcn, arundo-donax, im-jazz, flamenco-barrio)
- [ ] Afegir "Festivals" al menú principal a `hugo.toml`
- [ ] Afegir strings i18n per a festivals (ca.yaml + en.yaml)

### Serveis
- [ ] Actualitzar `data/serveis.yaml` amb el nou copy CA+EN
- [ ] Actualitzar strings CTA a `i18n/ca.yaml` i `i18n/en.yaml`

### Formulari
- [ ] Crear formulari wizard a tally.so seguint l'especificació
- [ ] Afegir `tallyFormContact` ID a `hugo.toml`
