# Full SEO Audit — pocallum.cat
**Data:** 23 juny 2026
**Metodologia:** 7 subagents en paral·lel (Tècnic, Local, Schema, Sitemap, Performance, GEO/IA, SXO)
**Pàgines analitzades:** Homepage, /serveis/, /qui-som/, /contacte/, /festivals/, /galeria/, /noticies/, pàgines de serveis individuals

---

## Scores globals

| Àrea | Score | Notes |
|------|-------|-------|
| SEO Tècnic | **78/100** | Bones bases, bugs corregibles |
| Local SEO | **54/100** | Sense GBP és quasi invisible localment |
| GEO / IA | **74/100** | llms.txt molt bo, manca autoritat de marca |
| SXO | **61/100** | Page-type mismatch vs competència |
| Performance (estimat) | **~55/100** | LCP 3-4s+ per hero JS; CLS galeria |
| **GLOBAL** | **~64/100** | |

---

## 1. SEO TÈCNIC (78/100)

### Crític
**C1 — Els security headers no es serveixen des de GitHub Pages**
El fitxer `static/_headers` és una característica de Netlify/Cloudflare Pages, no de GitHub Pages. Cap dels headers de seguretat (`X-Frame-Options`, `X-Content-Type-Options`, `CSP`) arriba al navegador. L'únic que funciona és el `Referrer-Policy` com a meta HTML tag.
*Solució: Migrar a Cloudflare Pages (gratuït) o afegir Cloudflare com a proxy.*

### Alt
**H1 — FAQPage JSON-LD duplicat** a `/serveis/` i `/qui-som/`
El bloc FAQPage apareix dues vegades al HTML: una al `<head>` (partial) i una al `<main>` (template de pàgina). Google pot ignorar el rich result o generar advertències a Search Console.
*Solució: Eliminar l'emissió del JSON-LD inline del template de pàgina.*

**H2 — hreflang `x-default` absent a les pàgines EN**
A `head.html` línies 38–44, el `x-default` només s'emet quan `Language.Weight == 1` (CA). Les pàgines EN no inclouen `x-default` al seu propi `<head>`.
*Solució: Emetre el conjunt complet d'hreflang (incl. x-default) a totes les pàgines.*

**H3 — `og:type: article` a pàgines de secció i servei**
`head.html` línia 56 marca com `article` qualsevol pàgina que no sigui home. `/serveis/`, `/festivals/`, `/qui-som/` etc. haurien de ser `website`.
*Solució: `if or .IsHome .IsSection → website, else → article`*

**H4 — Imatges de galeria sense `width` i `height`**
`foto-card.html` línies 16–19. Sense dimensions explícites, el browser no reserva espai → CLS.

### Mitjà
- **M1** Dates `lastmod` futures (2030) al sitemap EN per festivals amb `date:` com a truc d'ordenació
- **M2** BreadcrumbList: noms amb cometes dobles escapades (`\"nom\"`) per doble `jsonify`
- **M3** `MusicFestival` schema per a tots els festivals independentment del tipus
- **M4** RSS autodiscovery a pàgines sense contingut RSS rellevant (`/serveis/`, `/contacte/`)
- **M5** `og:image` fallback és sempre el logo — per a un lloc de fotografia, pèrdua important per a social
- **M6** Radio inputs del wizard de contacte amb `value` buit → dades buides als envíaments

### Baix
- **L1** No hi ha IndexNow
- **L2** `<meta name="generator">` exposa la versió de Hugo
- **L3** `<link rel="shortcut icon">` és deprecated
- **L4** GoatCounter amb URL protocol-relative (`//gc.zgo.at/`) en lloc d'HTTPS explícit

### Destacats positius
- robots.txt net, `/admin/` bloquejat, tots els crawlers IA explícitament permesos
- `llms.txt` present i ben estructurat (bilingüe, URLs directes, bloc "for AI agents")
- Honeypot `/ai-ping/` per detectar robots IA
- Sitemap com a sitemap index amb sub-sitemaps per idioma
- Canonicals correctes (HTTPS, trailing slash, self-referencing)
- Viewport meta correcte
- Hero LCP image preload (tot i que no apunta a la imatge correcta — veure Performance)
- Fonts self-hosted en woff2, preloads dels dos fonts crítics
- JS només vanilla, `defer` correcte, tot SSR (cap JS rendering de contingut indexable)
- Schema molt complet: LocalBusiness+Photographer, NewsArticle, MusicFestival, FAQPage, BreadcrumbList, Person, WebSite+SearchAction

---

## 2. SEO LOCAL (54/100)

### La mancança més gran: sense GBP no hi ha local pack

El GBP (Google Business Profile) és el factor #1 de ranking local (Whitespark 2026). Sense un perfil verificat, pocallum.cat no pot aparèixer al local pack per cap cerca, independentment de la qualitat on-page.

La pàgina de contacte té un link a maps.google.com com a query de text — no un Place ID verificat. Això no confirma cap listing existent a Google.

### Ressenyes i reputació: 10/100
Zero ressenyes, zero testimonis, zero `aggregateRating` schema. Per a un servei creatiu on la confiança és el driver de compra principal, aquest és el gap de conversió més important del lloc.

### On-page local: 72/100
- Punts forts: title de portada amb "Barcelona", H2 "Fotografia cultural a Barcelona", referències a barris (Nou Barris, Segrera, Jamboree, Nau Bostik), sub-pàgines de serveis amb "Barcelona" als títols
- Gap crític: el `/serveis/` principal no té "Barcelona" al H1 ni al title
- Bug: les capçaleres dels grups de serveis (`<h3>`) es renderitzen buides (template llegeix `.nom` en lloc de `.titol`)
- Gap: footer NAP incomplet (falta carrer i telèfon)

### NAP: 55/100
| Font | Nom | Adreça | Telèfon |
|------|-----|--------|---------|
| JSON-LD homepage | Pocallum | Carrer dels Ferrocarrils Catalans 2-14, 08020 Barcelona | +34 687 836 757 |
| Pàgina contacte | Pocallum | Nau Bostik, Carrer dels Ferrocarrils Catalans 2-14 | **absent** |
| Footer (totes) | Pocallum | Nau Bostik, Barcelona | **absent** |
| hugo.toml | Pocallum | Nau Bostik, Barcelona | +34 687 836 757 |

El telèfon existeix al schema però no és visible a cap pàgina. Google usa la co-ocurrència entre schema i text visible per confirmar el NAP.

### Schema local: 78/100
- Dual typing `LocalBusiness + Photographer` correcte
- `geo`, `openingHoursSpecification`, `hasOfferCatalog`, `knowsAbout` (17 especialitats) presents
- Gap: coordenades amb 5 decimals (recomanat 6+); verificar que apunten exactament a Nau Bostik
- Gap: `aggregateRating` absent (blocat per falta de ressenyes)
- Gap: `sameAs` només inclou Instagram i blog — falta GBP, Facebook

### Autoritat local: 65/100
- Bones relacions institucionals documentades: Nau Bostik, Ateneu Popular 9Barris, FAVB, 9Barris Imatge
- Clients nomenats a la portada: Festival Blues Barcelona, BAUM, Vijazz, FITI...
- Gap: cap d'aquells clients té un testimonial visible al lloc
- Gap: cap cobertura de premsa enllaçada (Time Out Barcelona, Enderrock...)

---

## 3. PERFORMANCE (estimat)

### LCP: POOR (estimat 3–4s+)
**Causa principal:** El hero de la portada es renderitza com a `background-image` injectat per JavaScript. El preload scanner del navegador no pot descobrir ni precarregar la imatge. El preload que existeix al `<head>` apunta a la primera imatge de la galeria — però l'hero tria una imatge aleatòria en temps d'execució JS, de manera que el preload quasi mai és útil.

Cadena de càrrega actual: HTML → JS descarregat → JS analitzat → JS executat → sol·licitud d'imatge. Amb una 4G típica: +1.5–2s de retard respecte a una `<img>` server-rendered.

*Solució: Triar la imatge hero a build time (Hugo template), renderitzar com `<img fetchpriority="high">`, preload exacte.*

### CLS: NEEDS IMPROVEMENT (estimat 0.1–0.2+)
Dues causes:
1. **Galeria mosaic:** El JS aplica classes de mida (tall/wide/big/hero) i fa shuffle dels elements DOM *després* del primer render. Layout shift garantit en cada càrrega.
2. **`<img>` sense dimensions:** `foto-card.html` sense `width`/`height` → el browser no reserva espai.
3. **Hero title phrase-swap:** Si la frase escollida té més línies que l'anterior, empeny tot el contingut avall.

### INP: GOOD (estimat <200ms)
JS minimal, event listeners passius, cap biblioteca pesada. Cap risc.

### Altres
- CSS: un únic bundle blocking (optimitzable amb critical CSS inline)
- `__heroData` inline script de ~15–25KB bloqueja el parser HTML
- Fonts: 2/6 fonts precarregades (OK), `font-display: swap` a tots

---

## 4. SITEMAP

### Problemes alt
- **Dates futures (2030):** Festivals amb `date: 2030-xx-xx` com a truc d'ordenació → el sitemap index mostra `lastmod: 2030-01-09`. Google descarta el senyal de freshness.
- **`translationKey` absent:** Hugo relaciona traduccions per nom de fitxer. `concerts.md` (CA) ↔ `live-music.md` (EN) no es reconeixen com a traduccions → el sitemap no emet hreflang cross-links entre les pàgines de serveis CA i EN.
- **`enableGitInfo = false`:** Els `lastmod` depenen exclusivament del frontmatter `date:`. Activar `enableGitInfo = true` + `fetch-depth: 0` a GitHub Actions proporcionaria dates automàtiques i precises.

### Problemes mitjans
- `<changefreq>` i `<priority>` al template: Google els ignora des de 2023. Eliminar per reduir pes.
- Hreflang self-tag duplicat en pàgines sense traducció (línies 14–17 del template)
- Pàgines legals al sitemap (cap valor SEO)

### Destacats positius
- Estructura com a sitemap index (correcte per a bilingüe)
- Hreflang `<xhtml:link>` dins de cada URL del sitemap (implementació correcta)
- `x-default` present per a CA
- `/cerca/` exclosa amb `sitemap: disable: true`
- `image:` extension present per a imatges

---

## 5. GEO / IA SEARCH (74/100)

### Fortaleses destacades
- Accés AI crawlers: 98/100 — GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot tots explícitament permesos
- `llms.txt` present, bilingüe, 177 línies, amb bloc "for AI agents" i intent-matching queries — top 10% del sector
- Schema molt complet — font d'extracció clara per a IA
- Arquitectura estàtica Hugo: contingut 100% disponible sense JS (ideal per a AI crawlers)

### Gaps
- **Densitat de prosa per citació:** Les pàgines de serveis tenen menys de 100 paraules de prosa. La finestra òptima per citació d'IA és 134–167 paraules. Cap pàgina de servei arriba al llindar.
- **YouTube absent:** La presència a YouTube té la correlació més alta amb citació per IA (0.737). El vídeo Vimeo existent (Los Mambo Jambo) no té equivalent YouTube.
- **Estadístiques a llms.txt però no a les pàgines HTML:** "Fotògraf oficial del Festival Blues Barcelona 2002–2015", "5 fotoliibres publicats" — existeixen al llms.txt però no al contingut indexable.
- **RSL 1.0 absent:** El fitxer llms.txt no declara llicència explícita d'ús per a recuperació. Alguns sistemes IA prioritzen fitxers amb RSL 1.0.
- **Inconsistència de dates:** CA diu "des del 2010" (marca Pocallum), EN diu "active since 2002" (Joan com a fotògraf). Aclarir el framing.

---

## 6. SXO — SEARCH EXPERIENCE (61/100)

### El problema central: page-type mismatch

Els top-10 resultats per "fotògraf concerts Barcelona" i "concert photographer Barcelona" són **landing pages d'un sol servei** amb H1 keyword-targeted, llista de servei, prova social, FAQ, i un únic CTA. Pocallum compita amb una pàgina hub de marca (portada) i una pàgina d'overview de serveis — i perd.

No existeix cap URL de pocallum.cat al top-10 per cap d'aquestes queries comercials principals.

### Persona scoring

| Persona | Score | Gap principal |
|---------|-------|---------------|
| Coordinador festival (decision) | 75/100 | Sense case studies de cobertura |
| Productora teatre (awareness) | 68/100 | "Teatre i dansa" enterrat com a sub-ítem |
| Manager de banda (consideration) | 64/100 | Sense lliuraments especificats (format, quantitat, termini) |
| Director festival internacional (consideration) | 56/100 | EN no apareix per la query EN; pàgina EN sense keywords geo |
| Programador de sala (decision) | 54/100 | No s'adreça escala de club; sense rang de preus |

### Camí a la conversió actual vs recomanat

**Actual:**
`[Entrada directa/referral]` → Hero tagline → Galeria → Overview serveis → Noticies → Strip clients → Footer

Problema: CTA "Demana pressupost" apareix abans que s'hagi establert confiança. El visitor ha vist 1 tagline i una galeria quan se li demana que faci un pressupost.

**Recomanat (per a landing pages noves):**
`[Entry via keyword]` → H1 keyword+city → 3 línies de servei → 6 imatges inline → Clients strip → Testimonial → FAQ (respon PAA) → CTA "Explica'ns el projecte"

### Gaps específics
- Sense landing pages keyword-targeted: cap URL per als 3 clusters principals
- `/serveis/` title i H1 sense "Barcelona"
- Sense meta descriptions: el resum automàtic no és un missatge de venda
- Formulari de 4 passos: alta fricció per a primer contacte
- Alt text de la galeria: 152 imatges amb text genèric ("Fotografia de cultura en directe — Pocallum (2024)")
- Sense video (el SERP integra vídeos curts cada cop més)
- EN homepage H1 de marca ("We make photos that understand music") sense cap senyal de keyword o geo

---

## Annexos

### Fitxers més afectats per les correccions

| Fitxer | Issues |
|--------|--------|
| `themes/pocallum/layouts/partials/head.html` | hreflang, og:type, og:image, schema duplicat, sameAs |
| `themes/pocallum/layouts/partials/foto-card.html` | Dimensions img, alt text |
| `themes/pocallum/layouts/partials/schema-breadcrumb.html` | Double-encoding |
| `themes/pocallum/layouts/index.html` | Hero server-rendered, __heroData |
| `themes/pocallum/layouts/sitemap.xml` | changefreq, priority, hreflang self-tag |
| `themes/pocallum/assets/js/main.js` | Gallery CLS, hero title min-height |
| `hugo.toml` | enableGitInfo, disableHugoGeneratorInject |
| `content/ca/serveis/_index.md` + EN | H1, description, telèfon |
| `content/ca/festivals/*.md` | Dates futures, translationKey |
| `static/llms.txt` | RSL 1.0, date inconsistency |

### Competidors a analitzar
- gerybadia.es — landing page concerts Barcelona, posicionament fort
- nuriaaguade.com — entrega de lliuraments molt clara (respon PAA)
- andreanomura.com — "per què un especialista" section (adreça persona awareness)
- aleksandradynasphoto.com — event photographer Barcelona EN

---

*Report generat per 7 agents SEO especialitzats en paral·lel. Per a dades live (rankings, backlinks, CWV field data) calen credencials Google API i DataForSEO.*
