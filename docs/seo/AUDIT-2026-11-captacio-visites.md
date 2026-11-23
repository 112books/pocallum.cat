# Auditoria de captació — com obtenir més visites de possibles clients

**Data:** 20 de novembre de 2026
**Fonts:** GoatCounter `pocallum` (dades reals del 8/5/2026 al 19/11/2026), build local de `pocallum.cat` (856 pàgines), prova de SERP a DuckDuckGo (20/11/2026, 10 cerques d'intent comercial), `static/stats/analytics.json`.
**Abast:** entendre d'on vénen les visites, per què no en vénen més, i què cal fer perquè arribin clients (festivals, sales, companyies, músics, actors).

---

## 1. Resum en una pàgina

| Mètrica | Valor | Lectura |
|---|---|---|
| Visites (194 dies amb dades) | **2.013** | ~**10 al dia**, ~310 al mes |
| Tendència mensual | 257 → 365 → 310 | **plana**; no hi ha creixement |
| Temps mitjà al lloc | 42 s | correcte per a un portfolio |
| Formularis enviats | **6 en tot el període** | ~0,5 leads/mes |
| Visites a `/contacte/` | 59 | 1 de cada 34 visites arriba al formulari |
| Visites des de Google | 301 (**15%**) | el 85% és directe o xarxa |
| Cerques comercials on sortim (top 10) | **1 de 10** | només `fotògraf de dansa Barcelona` (#2) |

**El diagnòstic curt:** el web no té un problema de disseny ni de velocitat — té un problema de **distribució i d'idioma**. Amb 10 visites al dia, cap retoc d'on-page mou la xifra: el que mou la xifra és *aparèixer* on busca el client (mapa, cercadors, directoris, premsa) i *dir-ho amb les seves paraules* (en castellà, que és com busca la majoria del mercat local).

**Els cinc moviments amb més retorn, per ordre:**

1. **Google Business Profile** (pendent des del juny). És l'únic que et posa al mapa de Barcelona per a «fotógrafo Barcelona». 2 h de feina manual, zero codi.
2. **Decidir què fem amb el castellà.** 8 de les 10 cerques que he provat són en castellà i el web no té cap pàgina que hi competeixi.
3. **Quatre pàgines de servei que falten:** jazz, flamenc, circ i «com funciona / quant costa».
4. **Passar jus del blog** (2.353 posts des del 2010) cap a les pàgines de servei.
5. **Arreglar la galeria com a pàgina de conversió** (224 visites/any, zero camí cap a contacte).

---

## 2. D'on vénen les visites (dades reals)

### Referents

| Origen | Visites | Comentari |
|---|---|---|
| Directe / desconegut | 2.366 | marca, enllaços sense referrer, apps |
| **Google** | **301** | SEO orgànic real, molt baix |
| Instagram (ig + l.instagram) | 136 | la xarxa que més funciona |
| **chatgpt.com** | **57** | ja hi ha tràfic d'IA (llms.txt fa la feina) |
| Facebook | 32 | |
| translate.goog | 30 | gent que llegeix el web traduït automàticament |
| blog.pocallum.cat | 22 | el blog envia poc |
| DuckDuckGo | 20 | |
| about.pocallum.cat | 19 | |

### Pàgines més vistes

`/` 597 · `/galeria` 224 · `/festivals` 104 · `/serveis` 82 · `/noticies` 71 · `/contacte` 59 · `/blog` 50 · `/qui-som` 45 · `/obra` 40 · `/en/noticies/photo-exhibitions-spaces-barcelona-guide` 53 · `/noticies/guia-exposicions-espais-fotografics-barcelona` 48 · `/serveis/books-per-actors` 32.

### El que funciona (i cal replicar)

- **La guia d'exposicions a Barcelona**: 101 visites entre CA i EN. És l'únic contingut informacional que atrau gent que no et coneix. Format guia = tràfic.
- **El blog**: les entrades més vistes (`prospe-beach-again` 86, `barcelona-gipsy-balkan-orchestra` 48, `ella-també-hi-era` 39) superen qualsevol pàgina comercial del web. El contingut viu on hi ha la història, no on hi ha el servei.
- **`/serveis/books-per-actors`**: 32 visites, la tercera pàgina de servei més vista. Hi ha demanda de books.

### El que no funciona

- **El 77% de les pàgines (661 de 856) comparteixen la mateixa meta description** genèrica. Google no té cap motiu per preferir-ne una.
- **152 fitxes de galeria tenen el `<title>` buit** (surten com « — Pocallum») perquè al frontmatter tenen `title: ""`. Són 152 pàgines que diuen literalment res.
- **`/galeria/` és un cul-de-sac**: 224 visites/any a una pàgina que només és una graella de fotos, sense text, sense enllaç a serveis i sense cap CTA dins del contingut.
- **`/blog` (50 visites)** i **`/el-blog/` (44)** conviuen: `pocallum.cat/blog/` serveix de fet el blog sencer per la porta del darrere (canònica a `blog.pocallum.cat`), i a més està blocat a `robots.txt`. Mig trencat, mig duplicat.

---

## 3. Prova de visibilitat: 10 cerques que faria un client

Fetes el 20/11/2026 (DuckDuckGo, top 10, sense personalització). No és Google, però és un proxy raonable del que veurà un organitzador de festival.

| Cerca | Pocallum | Qui hi surt |
|---|---|---|
| fotògraf de concerts Barcelona | **no** | Nuria Aguadé, Andrea Nomura, Robert Anton, Mattia Sedda, Daniel López |
| fotógrafo de conciertos Barcelona | **no** | Daniel López, Nuria Aguadé, Robert Anton, Lluís Ridao |
| fotografía de teatro Barcelona | **no** | Daniel López, Coleccionistas, Fotografia Creativa BCN, Mattia Sedda |
| book actoral Barcelona fotógrafo | **no** | Muse Estudio, Carles Cardelús, Abel Jurado, Carolina Kowarik |
| fotògraf de jazz Barcelona | **no** | Nuria Aguadé, Jazz Barcelona, Rambla, Tomajazz |
| fotógrafo de festivales de música Barcelona | **no** | Muse, Nuria Aguadé, Daniel López, Magdalena Bee, EDO |
| **fotògraf de dansa Barcelona** | **#2** | Pep Casadevall (1), **Pocallum (2)**, MW Fotografia |
| fotografía flamenc Barcelona | **no** | Foto Flamenca, Tablao Cordobés (turisme, no servei) |
| fotógrafo book artístico Barcelona | **no** | Muse, Fotografia Creativa, Carles Cardelús, Abel Jurado |
| fotògraf de circ Barcelona | **no** | Premsa i arxius municipals (nobody professional hi competeix) |

**Què fan ells que nosaltres no:**

1. **Títol amb la paraula exacta + ciutat:** «Fotógrafo de conciertos en Barcelona» en lloc de «Fotografia de concerts i directes a Barcelona».
2. **Una pàgina per especialitat**, no una pàgina per servei genèric. Tenen *Teatro, Danza, Ópera* en una; nosaltres tenim teatre i dansa junts i cap pàgina de jazz ni de flamenc.
3. **Castellà.** El mercat que busca «fotógrafo de conciertos Barcelona» no busca en català. Nosaltres no hi som, i no és un problema de posició: és que no existeix la pàgina.

**Dues oportunitats netes:** *jazz* (és el teu nucli i no tens pàgina pròpia) i *circ* (no hi ha cap fotògraf professional competint-hi — i tu has cobert la Mostra de Circ).

---

## 4. Diagnòstic detallat

### F1 · El castellà està desactivat — i el mercat busca en castellà
`hugo.toml` té `languages.es.disabled = true`. De les 10 cerques provades, 7 eren en castellà. El web és invisible per a totes elles, no per posició sinó per absència de pàgina.
**Opció A (ràpida):** activar ES només per a les 5-6 pàgines de servei (no tot el web). `content/es/serveis/` amb les mateixes pàgines, `translationKey` compartit, selector visible.
**Opció B (mínima):** una sola pàgina `/es/fotografo-conciertos-barcelona/` com a landing.
**Cost:** 4-8 h de traducció (les pàgines ja existeixen en CA i EN). **Impacte:** el més alt de tot l'informe després del GBP.

### F2 · Els títols parlen de «fotografia», no de «fotògraf»
`themes/pocallum/layouts/partials/head.html:16` genera `{{ .Title }} — Pocallum`. Resultat: «Fotografia de concerts i directes a Barcelona — Pocallum». Correcte, però ningú busca «fotografia de concerts»: busca «fotògraf de concerts Barcelona». El mot *fotògraf/fotògrafo* no apareix a cap `<title>`, i a `/serveis/` l'H1 és «Serveis fotogràfics» sense Barcelona.
**Fix:** reescriure els `title` de les 10 pàgines de servei amb el patró *[fotògraf de X a Barcelona — benefici]*, i posar Barcelona a l'H1 de `/serveis/`.
**Cost:** 1 h. **Impacte:** CTR a les poques cerques on ja hi ets, i senyal d'idioma.

### F3 · Sense Google Business Profile
Continua pendent des del 23/6/2026 (`docs/seo/ACTION-PLAN.md` → C1). Sense fitxa no existeixes al Local Pack per a «fotógrafo Barcelona», que és la cerca amb més intent de compra de totes. A més, `sameAs` del schema (`head.html:136-140`) només té Instagram, Facebook i el blog: no hi ha ni GBP, ni LinkedIn, ni Behance.
**Cost:** 2 h manuals + 10 fotos + demanar 5 ressenyes als festivals amb qui has treballat. **Impacte:** el més alt de la llista. **No és codi, és gestió.**

### F4 · Falten pàgines de servei per especialitat
Tens `concerts`, `teatre-dansa`, `books-per-actors`, `books-artistics`, `festivals-i-sales`, `sessio-banda`, `fotollibre`, `portada-disc`, `portada-identitat`, `edicions-limitades`. Falten:
- **Jazz a Barcelona** (el nucli: ViJazz, Jazz I Am, Jamboree, Ciutat Flamenco…) — 0 pàgines.
- **Flamenc** (Ciutat Flamenco, Flamenco de Barrio) — 0 pàgines.
- **Circ** (Mostra de Circ) — 0 pàgines.
- **Com funciona i quant costa** (encara que sigui «no hi ha tarifes tancades»: explicar què inclou, terminis, formats i franja de preus) — 0 pàgines. És la cerca que fa un organitzador quan ja t'ha triat.
**Cost:** 4-6 h cadascuna (tens material i fotos de sobres). **Impacte:** són les pàgines que capturen la cerca exacta.

### F5 · El blog no passa jus ni clics cap al servei
2.353 posts, 137.029 paraules, i només 22 visites arriben al web pare des del blog. Cada crònica de festival hauria de tancar amb un enllaç contextual a la pàgina de servei corresponent («Cobrir aquest festival és la meva feina: mira com treballo»). Ara no ho fa.
**Fix:** camp `related`/CTA automàtic al template del blog per categoria (jazz → /serveis/concerts/, teatre → /serveis/teatre-dansa/, etc.). És una feina al repo del blog, no en aquest.
**Cost:** 3-4 h al repo del blog. **Impacte:** mitjà-alt i acumulatiu.

### F6 · 152 fitxes de galeria amb `<title>` i `<h1>` buits
`content/ca/galeria/*.md` amb `title: ""` (ex. `img-2331.md`). Generen `<title>— Pocallum</title>` i cap encapçalament. Són 152 de 250 fitxes.
**Fix immediat (tècnic):** fallback al template de `galeria/single.html` i a `head.html` (`.Title` buit → «Fotografia de {servei} — {any}»).
**Fix bo (editorial):** posar títols reals per lots (qui surt, on, any).
**Cost:** 20 min el fallback, 2-3 h els títols reals.

### F7 · El contingut informacional funciona — i només n'hi ha un
La guia d'exposicions és la pàgina que més gent porta de fora (101 visites CA+EN). Format: llistat útil, actualitzat, de Barcelona, amb noms i enllaços. No n'hi ha cap més.
**Propostes del mateix patró:** «Sales de concert de Barcelona on es pot fotografiar sense flash», «Calendaris de festivals de jazz i blues a Catalunya», «Com preparar el book d'actor: què demana un càsting», «Què mira un programador de festival a les fotos d'un grup».
**Cost:** 3 h per guia. **Impacte:** alt a mig termini; és l'única via per créixer sense dependre de la marca.

### F8 · La conversió té fricció i el 60% cau a mig formulari
Embut del wizard: 18 inici → 8 al pas 3 → 6 enviats. És a dir: del pas 1 al 3 es perd més de la meitat. A més, `/galeria/` i les fitxes de festival no tenen cap CTA dins del contingut (només capçalera i peu), i `/contacte/` rep 59 visites/any però té 4 passos.
**Fix:** formulari de 3 camps (nom, mail, què necessites) amb el wizard com a opció «vull afinar el pressupost»; CTA al peu de cada fitxa de festival i sota la graella de la galeria.
**Cost:** 2-3 h. **Impacte:** multiplica els mateixos leads sense necessitat de més tràfic.

### F9 · Fuita de tràfic i URLs mortes
- `pocallum.cat/blog/` serveix el blog sencer (50 visites) i està blocat a `robots.txt`: ni consolida ni deixa de duplicar. Cal 301 a `https://blog.pocallum.cat/` i treure'l del `Disallow`.
- 404 heredats de WordPress amb tràfic: `/servicios-fotograficos/`, `/servees-fotografics-2/...`, `/en/node/191/track`, `/bienvenidos-pocallum/` (9+8+5+4 visites). Tres línies de `Redirect 301` a `static/.htaccess` ho arreglen.
- El defecte de `themes/pocallum/layouts/contacte/list.html:341` (`"//contacte/"`) envia a un domini inexistent si el formulari no té `action`. Corregit en aquesta sessió.

### F10 · La IA ja et porta gent (57 visites de ChatGPT)
`llms.txt` està ben fet i es nota. Per mantenir-ho: fitxes de festival amb dades fàctiques (any, lloc, disciplina), `schema.org` correcte (ja hi és) i un `llms.txt` actualitzat a cada notícia. Cost zero, manteniment.

---

## 5. Pla d'acció

### Setmana 1 — esforç baix, impacte immediat

| # | Acció | On | Cost |
|---|---|---|---|
| 1 | **Crear el Google Business Profile** i verificar-lo | manual | 2 h |
| 2 | Posar el mot *fotògraf* i *Barcelona* als `title` de les 10 pàgines de servei | `content/{ca,en}/serveis/*.md` | 1 h |
| 3 | H1 de `/serveis/` → «Serveis fotogràfics a Barcelona» | `content/ca/serveis/_index.md` | 5 min |
| 4 | 301 de `/blog/` a `blog.pocallum.cat` + treure el `Disallow` | `.htaccess` + panell | 30 min |
| 5 | 301 de les 4 URLs mortes de WordPress | `static/.htaccess` | 15 min |
| 6 | Fallback de títol a les 152 fitxes de galeria | `galeria/single.html` + `head.html` | 20 min |
| 7 | CTA de contacte al peu de la galeria i de cada festival | `galeria/list.html`, `festivals/single.html` | 1 h |
| 8 | Afegir GBP, LinkedIn i Behance a `sameAs` | `head.html` | 10 min |

### Mes 1-2 — les pàgines que falten

| # | Acció | Cost |
|---|---|---|
| 9 | **Decidir el castellà** (opció A o B de F1) i publicar les pàgines de servei ES | 4-8 h |
| 10 | Pàgines noves: *Fotografia de jazz a Barcelona*, *Fotografia de flamenc*, *Fotografia de circ* | 12-18 h |
| 11 | Pàgina *Com funciona i quant costa* (sense tarifes tancades, amb franja i què inclou) | 3 h |
| 12 | Reduir el formulari a 3 camps | 3 h |
| 13 | Segona guia informacional (sales on es pot fotografiar / calendaris de festivals) | 3 h |

### Mes 3-6 — acumulatiu

| # | Acció |
|---|---|
| 14 | CTA automàtic del blog cap a la pàgina de servei de cada categoria |
| 15 | Cobertura + crònica de 2-3 festivals amb nota de premsa que t'inclogui com a fotògraf oficial |
| 16 | Directoris: ANPF, Barcelona Activa, REEDPC, AADPC (books), APdC (dansa) |
| 17 | Títols reals per lots a les 152 fitxes de galeria |
| 18 | 10 ressenyes a GBP demanades als festivals on has treballat |

### Decisions que només pot prendre en Joan

- **Castellà sí o no** (F1). És la decisió amb més impacte de tot l'informe i xoca amb la regla actual de «no activar-lo». Cal decidir-ho explícitament.
- **GBP**: requereix verificació postal i una adreça pública. Si la Nau Bostik no ha de ser pública, cal decidir quina adreça es publica.
- **Pàgina de preus**: trenca el «sense tarifes tancades». Es pot fer sense trair-ho (franja + què inclou) o no fer-la.

---

## 6. Com mesurar-ho (i no enganyar-se)

Tauler `/stats/`, un cop al mes:

| KPI | Ara | Objectiu 6 mesos |
|---|---|---|
| Visites/mes | ~310 | 800+ |
| Visites des de Google | 301/any | 1.200/any |
| Pàgines que porten tràfic (no portada) | 3 | 10 |
| Formularis/mes | 0,5 | 2 |
| Cerques comercials on surts (top 10) | 1/10 | 4/10 |

I el que no surt al tauler però és el que compta: **quants pressupostos surten d'una visita al web**. Avui el 15% del tràfic ve de Google; si GBP + castellà + les pàgines noves funcionen, aquest percentatge hauria de pujar per sobre del 30% en mig any.

---

## Annex — com reproduir l'auditoria

```bash
# tràfic
python3 -c "import json;d=json.load(open('static/stats/analytics.json'));print(d['refs'][:10])"
# qualitat on-page (títols buits, descripcions duplicades)
hugo --minify && python3 scripts/audit-onpage.py   # (script proposat)
# visibilitat
curl -s "https://html.duckduckgo.com/html/?q=fot%C3%B2graf+de+concerts+Barcelona"
```

*Document generat el 20/11/2026. Dades de GoatCounter: 8/5/2026 – 19/11/2026 (194 dies amb registre).*

---

## Execució — 21/22 de novembre de 2026

Decisions preses: GBP endavant · castellà **sí** per a les pàgines de servei · pàgina de preus **no**.

### Fet i desplegat

| Acció | Estat |
|---|---|
| Fitxes de galeria: títol propi (152), imatge, data, servei i CTA | ✅ |
| Meta descriptions úniques per data a la galeria (661 → 217 pàgines) | ✅ |
| Títols de servei amb «fotògraf» + Barcelona (10 CA + 10 EN) | ✅ |
| Títol de /galeria/ i H1 de /serveis/ | ✅ |
| Banda de CTA a la galeria i a cada fitxa de festival | ✅ |
| 301 de /servicios-fotograficos/, /servees-fotografics-2/*, /bienvenidos-pocallum/, /node/*, /content, /es | ✅ verificat en viu |
| robots.txt sense `Disallow: /blog/` | ✅ |

### Troballes noves

1. **Les fitxes de galeria no mostraven la foto.** No era només un títol buit: la plantilla per
   defecte no pintava la imatge, així que 250 pàgines eren literalment un títol i res més.
   Corregit amb una plantilla pròpia (`galeria/single.html`).
2. **El 301 de `/blog/` no és possible des del nostre `.htaccess`**: la ruta la serveix el vhost
   del blog, no el docroot principal. Solució aplicada: treure el `Disallow` perquè Google
   llegeixi el canonical cap a `blog.pocallum.cat` i consolidi. El 301 dur requeriria Dinahosting.
3. **Preus: cap fotògraf individual els publica.** Revisats quatre competidors que rankegen per
   «fotógrafo de conciertos Barcelona»: tres no diuen res de preus i un diu «depèn del format»
   sense xifra. Només les plataformes (partfy.com, experiències d'Airbnb) publiquen imports.
   Confirma la decisió de no fer pàgina de preus; sí una de «com funciona».
4. **Nau Bostik és al barri de La Sagrera** (districte de Sant Andreu — ho confirma l'Ajuntament
   de Barcelona). Si el Google Business Profile mostra «Sant Andreu», cal canviar-lo a La Sagrera.

### Pendent

- Castellà de les pàgines de servei (10 pàgines; el mercat cerca majoritàriament en castellà).
- Pàgines noves: jazz, flamenc, circ i «com funciona».
- Segona guia informacional.
- Buidar la caché de Varnish del panell de Dinahosting després dels canvis.
- Actualitzar el robots.txt des del panell si el SEO Toolkit el regenera.
\n---\n\n## Fitxa de Google Business Profile — 20/11/2026\n\nLa fitxa **existeix i està plena** (el punt 1 de la setmana 1 i tot F3 d'aquest informe\nqueden tancats). Dades publicades:\n\n| Camp | Valor |\n|---|---|\n| Categoria principal | Fotògraf |\n| Categories secundàries | Servei de fotografia · Estudi fotogràfic · Fotògraf/a comercial |\n| Adreça | Carrer Ferran Turné, 1-11, 08027 Barcelona (La Sagrera, Sant Andreu) |\n| Telèfon | 687 83 67 57 |\n| Web | **http://pocallum.cat/** |\n| Horari | dl–dv 16:00–20:00 · ds i dg tancat |\n| Data d'obertura | 9 de novembre de 2002 |\n| Xarxes | facebook.com/pocallum · instagram.com/pocallum |\n| Zona de servei | Barcelona |\n\n### Quadrat avui al web\n\n| Què | On | Abans |\n|---|---|---|\n| Fitxa afegida a sameAs del schema | head.html (portada i seccions) | només Instagram, Facebook i blog |\n| Horari del schema = el de la fitxa | head.html | 09:00–20:00 |\n| Adreça de les pàgines legals | content/ca i content/en, legal | Ferran Turné, 16, 08031 (codi postal equivocat) |\n| Paràmetre googleBusiness | hugo.toml | no existia |\n\n### El que queda a la fitxa (no és codi)\n\n1. **Canviar la web a https://pocallum.cat/.** Ara apunta a http:// i el servidor força\n   HTTPS: la fitxa envia un salt innecessari i perd senyal.\n2. **Aclarir les dates:** la fitxa diu obertura 2002 i «projecte des del 2010». El web diu\n   foundingDate 2002. Triar una versió i fer-la servir als tres llocs (fitxa, schema, llms.txt).\n3. **10 fotos i 5 ressenyes.** Les ressenyes són el que més mou el Local Pack i no hi ha\n   manera d'aconseguir-les des del codi: cal demanar-les als festivals on has treballat.\n4. **Publicacions setmanals:** una foto amb peu i enllaç al servei corresponent.\n5. Quan tinguis l'enllaç «Comparteix» del perfil, substituir el valor de googleBusiness\n   a hugo.toml per aquell enllaç canònic.\n