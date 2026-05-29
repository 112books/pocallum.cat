# Pla d'Acció SEO — pocallum.cat
**Data:** 2026-05-29 | **Basat en:** Auditoria completa 8/8 agents

---

## ✅ Fet (sessió 2026-05-29)

| Acció | Commit |
|-------|--------|
| HTTP→HTTPS sistèmic (workflow, canonical, OG, schema, hreflang) | `54e64d4` |
| Image sitemap 189 imatges (galeria + festivals + notícies) | `13974c0` |
| Preload hero LCP + fonts Syne/Inter | `54e64d4` |
| Hero bg inline + is-loaded (LCP sense JS) | `54e64d4` |
| llms.txt bloc EN amb declaracions fàctiques | `54e64d4` |
| OAI-SearchBot a robots.txt | `54e64d4` |
| /cerca/ exclosa del sitemap | `7322939` |
| changefreq/priority eliminats de hugo.toml | `7322939` |
| Person schema Joan Linux Martínez a qui-som | `0971717` |
| Alt texts galeria (servei+any) | `3b2aed1` |
| FAQ serveis + encapçalaments pregunta | `42eeabd` |
| **C1** Coordenades geo → Nau Bostik (41.40879, 2.19004) | `093f4e0` |
| **C2** foundingDate 2002 + streetAddress + postalCode + openingHours | `093f4e0` |
| **A5** site_tagline → "Fotografia cultural a Barcelona" | `093f4e0` |
| **A7** CTA "Demana pressupost" a /qui-som/ | `093f4e0` |
| **A1** BreadcrumbList schema a totes les pàgines internes | `96db1e7` |

---

## PENDENT — Continuar a l'estudi

### A2. WebSite schema a portada
**Esforç:** 10 min  
**Fitxer:** `themes/pocallum/layouts/partials/head.html` — dins el bloc `{{ if .IsHome }}`  
Afegir segon objecte JSON-LD (array):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Pocallum",
  "url": "{{ .Site.BaseURL }}",
  "inLanguage": "ca",
  "description": {{ .Site.Params.description | jsonify }},
  "potentialAction": {
    "@type": "SearchAction",
    "target": "{{ .Site.BaseURL }}cerca/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
```

### A3. Corregir NewsArticle schema
**Esforç:** 15 min  
**Fitxer:** `themes/pocallum/layouts/partials/head.html` — bloc `{{ else if and (eq .Type "noticies") (not .IsSection) }}`  
Afegir `publisher.logo` com a `ImageObject` i `mainEntityOfPage`:

```json
"mainEntityOfPage": {
  "@type": "WebPage",
  "@id": "{{ .Permalink }}"
},
"publisher": {
  "@type": "Organization",
  "name": "Pocallum",
  "url": "{{ .Site.BaseURL }}",
  "logo": {
    "@type": "ImageObject",
    "url": "{{ "images/logotip/pocallum-logo.png" | absURL }}",
    "width": 600,
    "height": 60
  }
}
```

### A4. Corregir MusicFestival schema
**Esforç:** 15 min  
**Fitxer:** `themes/pocallum/layouts/partials/head.html` — bloc `{{ else if and (eq .Type "festivals") (not .IsSection) }}`  
Afegir `startDate` i `location.address`:

```json
"startDate": "{{ .Date.Format "2006-01-02" }}",
"location": {
  "@type": "Place",
  "name": {{ .Params.lloc | default "" | jsonify }},
  "address": {
    "@type": "PostalAddress",
    "addressLocality": {{ .Params.lloc | default "Barcelona" | jsonify }},
    "addressCountry": "ES"
  }
}
```

### A6. Adreça i telèfon visibles a /contacte/
**Esforç:** 30 min  
**Fitxer:** `content/ca/contacte/_index.md`  
Afegir bloc NAP complet visible a la pàgina:
- Adreça: Nau Bostik, Carrer dels Ferrocarrils Catalans, 2-14, 08020 Barcelona
- Link a Google Maps
- Horari: "Per cita prèvia, de dilluns a divendres"
- Email: hola@pocallum.cat

### A8. Meta descriptions a festivals i notícies
**Esforç:** 30 min (template fallback automàtic ja funciona via `.Summary`)  
**Opció ràpida:** Verificar que el truncat a 160 caràcters funciona bé per als 10 articles de notícies prioritaris. Afegir `description:` manual als més importants.

---

## MITJÀ — Proper mes

### M1. Crear Google Business Profile
**Impacte:** Major — sense GBP no hi ha local 3-pack  
**Esforç:** 1-2h (creació + verificació)  
- Categoria principal: Photographer
- Categories secundàries: Event photographer, Commercial photographer
- Afegir: tots els serveis, mínim 10 fotos, adreça completa (Nau Bostik), URL web, horari

### M2. Dues landing pages de servei
**Impacte:** Estructural per a queries comercials  
**Esforç:** 4-8h  
- `/serveis/fotografia-concerts-barcelona/` — H1 keyword, portfolio jazz/blues, FAQ, CTA
- `/serveis/fotografia-arts-esceniques-barcelona/` — H1, portfolio teatre/dansa, clients, FAQ, CTA

### M3. Testimonials a serveis i portada
**Esforç:** 1h  
3-5 cites de clients nomenats (festivals, bandes, companyies). Format: text + nom + rol + data.

### M4. FAQ de drets i workflow
**Esforç:** 30 min  
Afegir a `content/ca/serveis/_index.md`:
- "Quants dies tarda Pocallum a lliurar les fotos?"
- "Quins drets d'ús inclouen les fotografies?"
- "Quantes fotos lliura Pocallum per sessió?"
- "Si treballeu amb analògic, es poden tenir fotos digitals ràpidament?"

### M5. Renombrar wizard Step 1 a language client
**Esforç:** 30 min  
Targetes del wizard: afegir subtext descriptiu a cada opció.

### M6. /blog/ noindex o nav directe a blog.pocallum.cat
**Esforç:** 10 min  
Opció A: `<meta name="robots" content="noindex">` a `layouts/blog/list.html`  
Opció B: Canviar link del nav per apuntar directament a `blog.pocallum.cat`

### M7. width/height a foto-card.html
**Esforç:** 15 min  
Afegir `width="1200" height="800"` a l'`<img>` de `foto-card.html:16` per eliminar risc CLS.

---

## BAIX — Backlog

### B1. Cloudflare davant de GitHub Pages
Security headers reals, WebP auto, caché llarg per imatges.

### B2. IndexNow al workflow
Ping post-deploy a `deploy-prod.yml` per a indexació immediata a Bing.

### B3. Presència Wikipedia
Stub per Joan Linux Martínez o Pocallum. Requereix fonts externes citables.

### B4. Canal YouTube
Making-of, cobertures de festival.

### B5. enableGitInfo = true
Per a lastmod precís al sitemap (`fetch-depth: 0` ja present al workflow ✅).

### B6. preconnect GoatCounter
`<link rel="preconnect" href="https://gc.zgo.at">` a `head.html`.

### B7. Citacions locals
Fotógrafo.es, Páginas Amarillas, Cylex Spain, base de dades espais culturals Ajuntament BCN.

---

## Resum de prioritats per a l'estudi (propera sessió)

**~1 hora, alt impacte:**
```
1. A2 — WebSite schema portada (10 min)
2. A3 — NewsArticle schema fix (15 min)
3. A4 — MusicFestival schema fix (15 min)
4. A6 — Contacte NAP visible (30 min)
```

**Mitja sessió addicional:**
```
5. A8 — Meta descriptions festivals/notícies
6. M6 — /blog/ noindex o nav directe
7. M7 — width/height foto-card
```
