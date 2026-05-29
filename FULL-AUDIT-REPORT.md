# Auditoria SEO Completa — pocallum.cat
**Data:** 2026-05-29 | **Versió:** Final (8/8 subagents completats)
**Lloc:** https://pocallum.cat — Fotografia cultural, Barcelona
**Motor:** Hugo 0.159 · GitHub Pages · CA (default) + EN

---

## Puntuació Global SEO: 64 / 100

| Categoria | Pes | Puntuació | Ponderat |
|-----------|-----|-----------|----------|
| Tècnic SEO | 22% | 81/100 | 17.8 |
| Qualitat contingut | 23% | 58/100 | 13.3 |
| On-Page SEO | 20% | 55/100 | 11.0 |
| Schema / Dades estructurades | 10% | 62/100 | 6.2 |
| Performance (CWV) | 10% | 52/100 | 5.2 |
| AI Search Readiness | 10% | 71/100 | 7.1 |
| Imatges | 5% | 68/100 | 3.4 |
| **TOTAL** | | | **64 / 100** |

> Nota: La majoria de problemes crítics identificats (HTTP, LCP hero, image sitemap, alt texts, FAQ, Person schema) ja han estat **resolts en aquesta sessió**. La puntuació reflecteix l'estat post-fixes.

---

## Resum Executiu

**Tipus de negoci:** Fotògraf cultural local · Hybrid (Nau Bostik + SAB) · Barcelona

### Top 5 Problemes Crítics (pendents)

1. **Coordenades geo incorrectes** — Schema apunta a l'Eixample (41.3851, 2.1734), no a La Segrera/Nau Bostik (41.40879, 2.19004). Error de ~3km que corromp el càlcul de proximitat de Google
2. **No hi ha Google Business Profile** confirmat — sense GBP, el lloc no pot aparèixer al local 3-pack per cap query
3. **Cap pàgina de servei dedicada** per a les queries objectiu ("fotògraf concerts barcelona") — problema estructural, els competidors top-10 tenen landing pages específiques
4. **Meta descriptions absents** a tots els festivals (27), notícies (10) i galeria (152)
5. **`_headers` de Netlify ignorat per GitHub Pages** — tots els security headers (CSP, X-Frame-Options, etc.) no s'estan aplicant

### Top 5 Guanys Ràpids (pendents)

1. Corregir coordenades geo al schema (`head.html` línies 85-88) — 5 min
2. Corregir `foundingDate: "2010"` → `"2002"` — 2 min
3. Afegir `streetAddress` + `postalCode` al schema — 5 min
4. Afegir "Barcelona" al títol de la portada — 2 min
5. Afegir CTA a `/qui-som/` — 10 min

### Ja resolt en aquesta sessió ✅

- HTTP→HTTPS sistèmic (canonical, OG, schema, hreflang, sitemap)
- Image sitemap 189 imatges (galeria + festivals + notícies)
- Preload hero LCP + fonts Syne/Inter
- Alt texts galeria amb servei+any
- llms.txt bloc anglès
- FAQ serveis + encapçalaments pregunta
- Person schema Joan Linux Martínez
- `/cerca/` exclosa del sitemap
- `changefreq`/`priority` eliminats
- `OAI-SearchBot` a robots.txt

---

## 1. SEO Tècnic — 81/100

### ✅ Correcte
- `robots.txt`: correcte, AI crawlers explícits, Sitemap present
- Viewport meta correcta
- Fonts amb `font-display: swap`
- Fonts crítiques precarregades
- JS amb `defer` — sense render-blocking scripts
- CSS únic (Hugo Pipes, fingerprinted, minificat)
- 404 amb `noindex`
- SSR via Hugo — tot l'HTML és indexable sense JS
- GoatCounter: cookieless, async, GDPR

### 🔴 Crític
**`_headers` és sintaxi Netlify — GitHub Pages no el serveix**
El fitxer `static/_headers` defineix X-Frame-Options, CSP, Referrer-Policy, etc., però GitHub Pages no llegeix ni aplica aquest format. Cap header de seguretat s'envia realment al navegador.
Opcions: (a) Cloudflare free tier davant de GitHub Pages, (b) `<meta http-equiv>` per CSP al head.

### 🟠 Alt
| Problema | Fitxer | Línia |
|----------|--------|-------|
| HSTS absent del `_headers` | `static/_headers` | 1 |
| `<img>` sense `width`/`height` → CLS risk | `foto-card.html` | 16 |
| `/blog/` stub en nav → pàgina prima indexada | `layouts/blog/list.html` | — |

### 🟡 Mitjà
| Problema | Detall |
|----------|--------|
| Hero preload pot no coincidir amb LCP real | JS randomitza després del preload SSR |
| EN menu URLs | Verificar que `relLangURL` prepend `/en/` correctament |
| CSP inclou `'unsafe-inline'` | Necessari pels JSON-LD inline |
| IndexNow absent | Afegir ping al workflow post-deploy |

### 🔵 Baix
- No `preconnect` per GoatCounter
- `buildFuture = true` — risc de publicar contingut prematur si `draft: false` accidentalment
- `markup.goldmark.renderer.unsafe = true` — XSS teòric si el contingut fos user-supplied

---

## 2. Qualitat de Contingut — 58/100

### Meta descriptions
**ABSENT a 189 pàgines:**
- Tots els festivals (27 CA + 27 EN)
- Totes les notícies (10 CA + 10 EN)
- Tota la galeria (152 CA)
- `/contacte/` — quasi buida (18 paraules total)

Les pàgines estàtiques principals (serveis, qui-som) sí que en tenen.

### Contingut prim
| Pàgina | Estat |
|--------|-------|
| `contacte/_index.md` | 18 paraules — quasi buit |
| `festivals/_index.md` | 21 paraules |
| Festivals petits (calella-harmonica, sax-o-rama, erratik, pigmes-revoltoses, ventanas-abiertas) | <100 paraules cos |

### Alt texts
- **Galeria:** ✅ fix aplicat (servei+any)
- **Notícies single:** usa `.Title` — funcional però genèric
- **Festivals single:** usa `.Title` — funcional però genèric

### Paritat EN
- `legal/` existeix només en CA
- Festival, notícies i galeria individuals: només scaffold `_index.md` en EN, sense contingut individual traduït

### E-E-A-T notícies
- Articles de notícies: senyals d'autoria via schema (Joan Linux Martínez), dates correctes, `lead` present a tots ✅
- Mancança: cap byline visible en el HTML renderitzat (l'autor és al schema però no a la pàgina)

---

## 3. On-Page SEO — 55/100

### Títols amb problema
| Pàgina | Títol actual | Problema |
|--------|-------------|----------|
| Portada | "Pocallum — Fotografia de cultura" | Falta "Barcelona" |
| `/contacte/` | "Parla amb nosaltres — Pocallum" | Cap keyword ni localitat |
| `/serveis/` desc | "...A pressupost, sense tarifes tancades." | Falta "Barcelona" |

### Problema estructural principal
**Cap pàgina pot rankejar per queries comercials locals.** El top-10 per "fotògraf concerts barcelona", "fotografia jazz barcelona", "concert photographer barcelona" i "fotògraf teatre barcelona" és dominat per landing pages de servei dedicades amb URL específica, H1 keyword-targeted i portfolio embegut.

Pocallum té: homepage (brand) → /serveis/ (overview genèric) → contacte. Cap URL apunta a cap query específica.

### Contingut que falta a les pàgines de serveis
Les pàgines no responen:
- Termini d'entrega (quants dies fins a rebre les fotos?)
- Drets d'ús (premsa, xarxes, arxiu, publicacions?)
- Nombre de fotos lliurades per sessió
- Flux de treball analògic → digital (es pot tenir fotos el dia següent?)

### Trust signals back-loaded
| Senyal | On és | Problema |
|--------|-------|---------|
| Fotògraf amb cara i nom | Només a `/qui-som/` | Visitant fred mai hi arriba |
| Clients nomenats | `/qui-som/` + `/festivals/` | No visible a portada ni serveis |
| Anys actiu | Subline portada | OK |
| Publicacions (3 fotollibres) | Taula trajectòria /qui-som/ | Enterrat |
| 19 festivals documentats | A /festivals/ | No surfejat a entrada |

### Wizard contacte
- Step 1 usa nomenclatura interna ("L'Instant", "La Producció") — un visitant fred no sap triar
- No hi ha imatge de mostra adjacent a cada opció

---

## 4. Schema / Dades estructurades — 62/100

### Existent i correcte ✅
- `LocalBusiness + Photographer` a portada (HTTPS)
- `NewsArticle` a notícies singles
- `MusicFestival` a festivals singles
- `Person` a qui-som (afegit avui)

### Errors a corregir

| Problema | Gravetat | Fitxer | Línia |
|---------|----------|--------|-------|
| `foundingDate: "2010"` → hauria de ser `"2002"` | 🟠 Alt | `head.html` | 96 |
| Coordenades geo errònies (Eixample, no Nau Bostik) | 🔴 Crític | `head.html` | 85-88 |
| `streetAddress` i `postalCode` absents | 🔴 Crític | `head.html` | 80-90 |
| `MusicFestival` sense `startDate` | 🟠 Alt | `head.html` | 121-136 |
| `MusicFestival` sense `PostalAddress` completa | 🟡 Mitjà | `head.html` | 128-130 |
| `NewsArticle` sense `publisher.logo` | 🟡 Mitjà | `head.html` | 103-120 |
| `NewsArticle` sense `mainEntityOfPage` | 🟡 Mitjà | `head.html` | 103-120 |

### Mancat

| Schema | Gravetat | Impacte |
|--------|----------|---------|
| `BreadcrumbList` a totes les pàgines internes | 🟠 Alt | Sitelinks SERP |
| `WebSite` a portada | 🟡 Mitjà | Sitelinks search box |
| `FAQPage` a /serveis/ | ℹ️ Info | Útil per IA, no per Google rich results |
| `openingHoursSpecification` | 🟠 Alt | Local ranking signal |

---

## 5. Performance / Core Web Vitals — 52/100

### LCP — Millorat ✅ (fix aplicat avui)
- Hero bg ara té inline style + `is-loaded` des del HTML
- Preload `fetchpriority=high` per primera imatge de galeria
- Fonts Syne + Inter precarregades
- Estimació post-fix: LCP ~1.5-2.5s (era ~4s+)

### CLS — Risc pendent
- `<img>` a `foto-card.html` sense `width`/`height` explícits
- Mosaic size classes assignades per JS (2 reflows garantits a galeria)

### INP — ✅ Baix risc
- JS bien estructurat, scroll passiu, RAF per animacions
- GoatCounter async

### Limitació GitHub Pages
- `Cache-Control: max-age=600` per a tot — sense CDN no es pot ampliar
- Solució: Cloudflare free tier

---

## 6. AI Search Readiness — 71/100

*(Resultat inalterats de l'auditoria matinal — vegeu secció 3 de l'informe parcial)*

### Millores aplicades avui ✅
- `llms.txt` amb bloc EN complet (declaracions fàctiques)
- `Person` schema Joan Linux Martínez
- `OAI-SearchBot` a robots.txt
- FAQ serveis + encapçalaments pregunta

### Pendent
- Cap entitat Wikipedia
- Cap canal YouTube (correlació ~0.737 amb citació IA)
- Cap LinkedIn
- `foundingDate` incorrecte al schema

---

## 7. Local SEO — 44/100

### 🔴 Crític
| Problema | Detall |
|---------|--------|
| Coordenades geo errònies | 41.3851/2.1734 → Eixample. Correcte: 41.40879/2.19004 (Nau Bostik) |
| `streetAddress` absent | "Carrer dels Ferrocarrils Catalans, 2-14" |
| `postalCode` absent | "08020" |
| GBP no confirmat | Sense GBP, impossible aparèixer al local 3-pack |

### 🟠 Alt
- `/contacte/` sense adreça física visible
- Homepage sense "Barcelona" al títol
- `openingHoursSpecification` absent
- Telèfon no visible a la portada (és al schema i a /contacte/ però no al footer)

### 🟡 Mitjà
- Cap testimonial ni `aggregateRating`
- `/serveis/` desc i `/contacte/` desc sense "Barcelona"
- Cap embed Google Maps a /contacte/
- Adreça inconsistent: "Nau Bostik, Barcelona" vs "Nau Bostik, barri de la Segrera"

---

## 8. SXO — Search Experience — 48/100

### Problema principal: page-type mismatch
| Query | Pàgina que ranka (competidors) | Pocallum té |
|-------|-------------------------------|-------------|
| fotògraf concerts barcelona | Landing page dedicada | Cap |
| fotografia jazz barcelona | Landing page + editorial | Cap |
| concert photographer barcelona | Landing page dedicada | Cap |
| fotògraf teatre barcelona | Landing page dedicada | Cap |

### Friction points
- Wizard Step 1: "L'Instant" / "La Producció" — nomenclatura interna, confusa per visitant fred
- `/qui-som/` no té cap CTA — dead end amb el millor contingut de confiança
- Per-service images no estan connectades visualment amb el servei que il·lustren
- La confiança (festivals, anys, fotògrafs, publicacions) viu a /qui-som/ — pàgina secundària

### Persona scores
| Persona | Puntuació |
|---------|-----------|
| Organitzador de festival | 54/100 |
| Companyia de teatre (dossier) | 57/100 |
| Músic de jazz (fotos de premsa) | 67/100 |
| Sala de concert/venue | 54/100 |
| Actor (book actoral) | 71/100 |

---

## Fitxers de Referència Principals

| Fitxer | Problema clau |
|--------|--------------|
| `themes/pocallum/layouts/partials/head.html` | Coordenades geo, foundingDate, schema NewsArticle/MusicFestival |
| `themes/pocallum/layouts/qui-som/list.html` | Falta CTA |
| `content/ca/contacte/_index.md` | Quasi buit, falta adreça |
| `content/ca/` festivals i noticies | Meta descriptions absents |
| `static/_headers` | Format Netlify, no funcional a GitHub Pages |
| `hugo.toml` | `site_tagline` / títol portada sense "Barcelona" |
