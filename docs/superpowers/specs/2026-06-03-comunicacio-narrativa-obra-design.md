# Spec: Comunicació narrativa i secció Obra
**Data:** 2026-06-03
**Estat:** Aprovat

---

## Problema

Els músics independents assumeixen que Pocallum és car per la qualitat del portfolio i els referents, sense saber que treballa a escales molt diverses. No hi ha marc de referència econòmic ni narrativa que connecti les disciplines (fotografia + edició + disseny + formació + editorial). La trajectòria com a creador i autor és a about.pocallum.cat però invisible des de pocallum.cat.

**Missatge clau a comunicar:** Joan no és un tècnic que executa encàrrecs — és un autor que també treballa per encàrrec. El criteri editorial és el mateix per a un quartet que debuta i per a un festival de deu anys.

---

## Decisions de disseny

### Enfocament general
**Portada narrativa (B):** la portada es reorganitza per explicar qui és Joan abans d'explicar què fa. L'obra apareix visible abans dels serveis.

### 1. Portada — nou flow de seccions

| # | Secció | Canvi |
|---|--------|-------|
| 01 | Hero | Sense canvis |
| 02 | Fotografies (grid aleatori galeria) | Sense canvis |
| 03 | **Tira d'obra** | **NOU** |
| 04 | **Serveis (3 blocs per client)** | **Reformulat** |
| 05 | Notícies | Sense canvis |

La `/galeria/` i la seva pàgina queden completament intactes.

### 2. Tira d'obra (secció 03 de portada)

Tractament discret. Sense títol de secció. Una fila horitzontal amb 4 cobertes petites (≈52×52px) i a la dreta dos elements en stack:

1. La narrativa pont en cursiva: *"L'obra pròpia informa la mirada amb què treballo per als altres."*
2. El link: *Fotollibres · Portades · Cartells →* (apunta a `/obra/`)

No hi ha descripció ni titular gran — les cobertes parlen soles.

**Narrativa pont a portada (dins la tira):**
> *"L'obra pròpia informa la mirada amb què treballo per als altres."*

**Narrativa pont per als altres tres webs** (112books, Llumàtics, LinuxBCN):
> *"Fotògraf, editor i docent. La memòria visual de la cultura independent a Barcelona, des del 2002."*

### 3. Secció /obra/ — nova

**Arquitectura:** pàgines Hugo individuals (content type `obra`), una sola pàgina `/obra/` amb dos apartats per ancoratge.

**Navegació:** nou ítem `Obra` al menú principal, entre Serveis i Blog.

**Estructura de `/obra/`:**
- Capçalera de pàgina breu
- Apartat `#fotollibres` — grid de cobertes (3 columnes desktop)
- Apartat `#discs` — grid de cobertes (4 columnes desktop)

**Pàgina individual d'obra** (fotollibre o disc):
```
coberta (160px) | títol
                | subtítol / artista
                | any · rol (fotografia / disseny / edició gràfica)
                | descripció breu (1-2 línies)
                | link extern (112books.eu / Bandcamp / etc.)
```

**Frontmatter de cada obra:**
```yaml
---
title: "Preses Falses"
subtitle: "40 anys de Blues a Barcelona"
tipus: "fotollibre"   # fotollibre | disc
any: 2022
rol: "fotografia"     # fotografia | disseny | edició gràfica | fotografia i disseny
artista: ""           # per a discs
editorial: "112books"
web: "https://112books.eu/..."
image: "/images/obra/preses-falses.jpg"
destacat: true        # apareix a la tira de portada si true
draft: false
---
```

**Ítems inicials coneguts:**

Fotollibres:
- *Preses Falses* (2022, fotografia, 112books)
- *I Wanna Be Your Dog* (2024, 112books)
- *aCarrejant* (2024, 112books)
- *Anónimos, más allá de las apariencias* (2025, amb Mario Ortiz)
- *Antropoformologies* (2026, sèrie 3 volums, dansa)

Discs i portades — **pendent de localitzar les cobertes i confirmar títols complets** (Big Dani Pérez, Bernat Font, altres).

**Cobertes de fotollibres:** obtenir de 112books.eu. Cobertes de discs: localitzar des de fitxers locals o plataformes (Bandcamp, etc.). Optimitzar a WebP, màx 600px costat llarg.

### 4. Serveis — reformulació en 3 blocs per client

Els 5 capítols actuals per disciplina (L'Instant, La Producció, El Paper, La Persona, L'Empresa Cultural) es substitueixen per 3 blocs orientats al client. El contingut detallat de cada disciplina s'incorpora dins del bloc corresponent.

**Bloc 01 — Per a músics i bandes**
- Directe i concerts
- Sessió de banda/artista (portada, premsa, xarxes)
- Portada de disc (fotografia i/o disseny gràfic)
- Missatge músics emergents integrat com a cita:
  > *"Treballem amb quartets que debuten i amb festivals de deu anys d'història. El criteri editorial és el mateix. El pressupost, no."*
- CTA: *Pressupost a mida · Parlem →*

**Bloc 02 — Per a festivals i sales**
- Cobertura completa d'event
- Arxiu i documentació reutilitzable
- CTA: *Pressupost a mida · Parlem →*

**Bloc 03 — Per a projectes editorials**
- Fotollibre (concepte, edició, disseny, impressió) — en sinergia amb 112books.eu
- Portada i identitat visual (disc, llibre, cartell)
- Edicions limitades col·leccionables
- CTA: *Pressupost a mida · Parlem →*

**Sense preus orientatius.** CTA única per bloc: "Pressupost a mida · Parlem →".

El FAQ i el CTA final de la pàgina de serveis es conserven tal com estan.

### 5. Connexió amb about.pocallum.cat

Dos punts d'entrada, cap intrusiu:

- **A `/qui-som/`**, al peu de la secció "L'ecosistema":
  > *La trajectòria completa com a autor, a [about.pocallum.cat →](https://about.pocallum.cat)*

- **A `/obra/`**, al header de pàgina (peu de capçalera):
  > *Sobre Joan Linux Martínez → [about.pocallum.cat](https://about.pocallum.cat)*

---

## Arquitectura tècnica

### Fitxers nous
```
content/ca/obra/_index.md          # pàgina principal /obra/
content/ca/obra/preses-falses.md   # exemple fotollibre
content/ca/obra/big-dani-perez.md  # exemple disc
content/en/obra/_index.md
content/en/obra/preses-falses.md
...
themes/pocallum/layouts/obra/
  list.html                        # /obra/ amb dos apartats ancoratge
  single.html                      # pàgina individual obra
themes/pocallum/assets/css/main.css  # nous estils: .tira-obra, .obra-grid, .obra-card
static/images/obra/                # cobertes optimitzades
```

### Fitxers modificats
```
themes/pocallum/layouts/index.html      # afegir tira d'obra (secció 03)
themes/pocallum/layouts/serveis/list.html  # 3 blocs per client
data/serveis.yaml                       # reestructurar en 3 grups per client
content/ca/serveis/_index.md            # actualitzar intro
content/en/serveis/_index.md
content/ca/qui-som/_index.md            # afegir link about.pocallum.cat
content/en/qui-som/_index.md
hugo.toml                               # afegir Obra al menú
i18n/ca.yaml                            # nous strings UI
i18n/en.yaml
```

### Content type `obra`
- `tipus`: `fotollibre` | `disc`
- `destacat: true` → apareix a la tira de portada (màx 4)
- Ordenació per defecte: `date` descendent (any de publicació)
- CA i EN obligatoris simultàniament (com festivals i notícies)

---

## Fora d'abast (aquesta fase)

- Castellà activat
- Pàgines individuals de disc amb reproductors embedits
- Integració directa amb 112books API
- Seccions de teatre, dansa o arts escèniques a /obra/ (poden afegir-se després)
- Redisseny del hero o del sistema de navegació

---

## Criteris d'èxit

- Un músic emergent que visita el site entén que pot demanar pressupost sense que sigui inaccessible
- Un visitant nou pot descobrir que Joan publica obra pròpia sense haver de navegar a about.pocallum.cat ni a 112books.eu
- La galeria de directes i la secció de festivals no queden eclipsades per la nova secció d'obra
