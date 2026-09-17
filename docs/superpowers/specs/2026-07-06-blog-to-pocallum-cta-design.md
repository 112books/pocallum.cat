# Pla: CTA blog.pocallum.cat → pocallum.cat

> Document de treball. Anàlisi, opcions tècniques, pla d'implementació i avaluació de ROI.
> Creat: 2026-07-06 | **Implementat: 2026-07-07**

## Estat: ✅ IMPLEMENTAT

**Fase 2 (CTA post-contingut) implementada directament al tema pare** (`wp-content/themes/twentytwentyfive/functions.php`).

- CTA rotatori: 3 frases genèriques, 3 de concerts/festivals, 2 d'arts escèniques
- Contextual per categoria WordPress
- Links amb UTM per mesurar a GoatCounter
- Documentació al servidor: `/home/pocallum/www/blog/POCALLUM-CTA-README.md`
- **Nota:** S'ha editat el tema pare directament (no child theme — TT25 FSE no permet child themes sense perdre Global Styles). Si s'actualitza TT25, cal tornar a afegir el bloc entre els comentaris `POCALLUM CTA` del functions.php.

**Pendent:** Fase 1 (widget sidebar) i Fase 3 (barra temporal de festivals) — opcionals.

---

## 1. Situació actual

### El blog

`blog.pocallum.cat` és un WordPress actiu des del 2010, allotjat a LinuxBCN. Conté:

- **2.339 articles** publicats (195 pàgines paginades)
- **3.000+ etiquetes** temàtiques
- **Temàtiques:** festivals de música, concerts, Nou Barris, fotografia analògica i experimental, càmeres
- **CTA existent:** només hi ha links puntuals a 112books.eu per a llibres
- **CTA a pocallum.cat:** cap

### La web principal

`pocallum.cat` és un Hugo static site amb portafoli, serveis, galeria i festivals coberts. Depèn de contactes directes i SEO orgànic per generar leads.

### El problema

El blog és un actiu enorme — 16 anys de contingut indexat sobre festivals, concerts i cultura a Barcelona — però no fa cap pont cap als serveis professionals de Pocallum. Un organitzador de festival que llegeix el post del Blues de Barcelona no sap que Pocallum ofereix fotografia professional d'aquell festival. **El pont no existeix.**

---

## 2. L'oportunitat

El lector típic del blog és:

- Aficionat a la música i la cultura urbana de Barcelona
- Organitzador de festivals o concerts (perfil potencial de client)
- Músic o artista (necessita book, portada de disc, press kit)
- Periodista cultural o programador

Tots ells passen per contingut altament rellevant als serveis de Pocallum: concerts, festivals, jazz, blues, teatre, dansa, analògic. La intenció del lector i l'oferta del fotògraf s'alineen perfectament. Afegir CTAs és qüestió de construir el pont.

**Potencial conservador:** si el blog té 500 visites/mes orgàniques (estimació baixa per 2.339 articles), i un CTA aconsegueix un 0,5% de conversió a contacte, serien ~2-3 consultes noves al mes. A un tancament de 25%, 1 client nou cada 2 mesos potencial.

---

## 3. Tres enfocaments tècnics

### Enfocament A — Widget de sidebar (molt fàcil, 1-2h)

Afegir un widget d'HTML personalitzat a la sidebar del blog. El widget conté una targeta visual amb el CTA.

**Implementació:**
- WP Admin → Aparença → Widgets → afegir "HTML personalitzat"
- HTML amb `<div class="pocallum-cta">` + imatge/text/link
- CSS via "Personalitzar → CSS addicional" o plugin Custom CSS

**Pros:**
- No requereix tocar PHP ni el tema
- Reversible en 2 clics
- Funciona en qualsevol tema de WordPress
- Visible a totes les pàgines amb sidebar

**Contres:**
- La sidebar pot tenir poca visibilitat en mòbil (sovint col·lapsada al final)
- No és contextual (mateix CTA per a tots els posts)

**Esforç:** 1-2 hores (incloent disseny del copy i CSS)
**Risc:** molt baix

---

### Enfocament B — Hook post-contingut a functions.php (mig, 3-5h)

Afegir una funció al tema (o child theme) que injecta un bloc CTA just després de cada post.

```php
add_filter( 'the_content', 'pocallum_cta_after_post' );
function pocallum_cta_after_post( $content ) {
    if ( ! is_single() ) return $content;
    $cta = '<div class="pocallum-cta-block">
        <p>Fotografia professional de concerts i festivals</p>
        <a href="https://pocallum.cat" target="_blank">pocallum.cat →</a>
    </div>';
    return $content . $cta;
}
```

**Pros:**
- Apareix dins del flux de lectura, molt visible
- Es pot fer contextual per categoria (concerts → CTA concerts; analògic → CTA sessions artístiques)
- Alta visibilitat en mòbil (dins del contingut)

**Contres:**
- Requereix editar `functions.php` → cal child theme per no perdre canvis amb updates
- Lleugerament més complex tecnicamente
- Afecta 2.339 posts retroactivament (pot ser bo o tenir una mica de risc visual si algun post té format estrany)

**Esforç:** 3-5 hores (child theme + funció + CSS + proves visuals + copy per categoria)
**Risc:** baix si es fa bé amb child theme

---

### Enfocament C — Barra de notificació sticky (fàcil-mig, 2-3h)

Una barra estreta i fixa a la part superior de totes les pàgines del blog amb un missatge curt i un link a pocallum.cat. Similar al "Hello Bar" però sense plugin de pagament.

**Implementació:**
- Afegir snippet CSS + JS al `functions.php` o via plugin "Insert Headers and Footers"
- La barra apareix sempre, és descartable (botó ×), i persiste via `localStorage`

**Pros:**
- Molt visible, a totes les pàgines
- No interromp la lectura
- Pot tenir missatge de temporada (festival X → "hem cobert el festival X, mira la galeria")

**Contres:**
- Pot ser percebut com a spam si el missatge no és ben calibrat
- Requereix gestió del copy (actualitzar-lo quan convingui)

**Esforç:** 2-3 hores
**Risc:** baix-mig (risc d'experiència de l'usuari si el disseny és agressiu)

---

## 4. Recomanació

**Fer A + B en paral·lel. Opcional C per a temporades de festival.**

- **A (sidebar):** Ràpid, permanent, no invasiu. Fa visible Pocallum a tota la sidebar.
- **B (post-contingut):** El CTA de màxim impacte — el lector ha acabat el post i és el moment de l'oferta. Contextualitzar per categoria multiplica la rellevància.
- **C (barra):** Activar-la durant festivals (Blues, VijazZ, Arundo) amb link directe a la pàgina del festival a pocallum.cat.

---

## 5. Pla d'implementació

### Fase 0 — Diagnosi del WP (30 min)

Abans de tocar res:

1. Identificar el tema actiu: WP Admin → Aparença → Temes
2. Comprovar si existeix child theme. Si no → crear-lo (2 fitxers: `style.css` + `functions.php`)
3. Anotar les àrees de widgets disponibles
4. Fer backup del tema (Aparença → Editor → copiar `functions.php` en local)

**Output:** Saber on toca i tenir backup.

---

### Fase 1 — Widget sidebar (1-2h)

**Tasca 1.1 — Copy del CTA**

Redactar 2-3 versions curtes. Exemples:

> "Fotografia professional de concerts i festivals a Barcelona. [pocallum.cat →]"

> "Has llegit el post. Si organitzes l'event, parlem. [pocallum.cat →]"

> "Vols fotos com aquestes per al teu festival? [Pressupost sense embuts →]"

**Tasca 1.2 — HTML del widget**

```html
<div class="poca-cta-sidebar">
  <img src="https://pocallum.cat/images/logotip/pocallum-logo.png" alt="Pocallum" width="80">
  <p>Fotografia professional de concerts, festivals i arts escèniques a Barcelona.</p>
  <a href="https://pocallum.cat/serveis/" class="poca-cta-btn">Veure serveis →</a>
</div>
```

**Tasca 1.3 — CSS**

Via Personalitzar → CSS addicional:

```css
.poca-cta-sidebar {
  background: #080808;
  border-left: 3px solid #FF5500;
  padding: 1.2rem;
  margin: 1.5rem 0;
  font-family: sans-serif;
}
.poca-cta-sidebar p {
  color: #f0f0f0;
  font-size: 0.9rem;
  margin: 0.5rem 0;
}
.poca-cta-btn {
  display: inline-block;
  background: #FF5500;
  color: #fff;
  padding: 0.5rem 1rem;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: bold;
}
.poca-cta-btn:hover { background: #cc4400; }
```

---

### Fase 2 — CTA post-contingut (2-3h)

**Tasca 2.1 — Crear/verificar child theme**

Si no existeix child theme:
1. Crear carpeta `/wp-content/themes/NOM-TEMA-child/`
2. `style.css` mínim:
```css
/*
Theme Name: NOM-TEMA Child
Template: NOM-TEMA
*/
```
3. `functions.php` mínim:
```php
<?php
add_action( 'wp_enqueue_scripts', function() {
    wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' );
});
```
4. Activar el child theme des de WP Admin

**Tasca 2.2 — Funció contextual**

Afegir al `functions.php` del child theme:

```php
add_filter( 'the_content', 'pocallum_cta_after_post' );
function pocallum_cta_after_post( $content ) {
    if ( ! is_single() || ! in_the_loop() ) return $content;
    
    // Contextualitzar per categoria
    $cta_text = 'Fotografia professional de concerts i festivals a Barcelona.';
    $cta_url  = 'https://pocallum.cat/serveis/';
    
    if ( has_category( ['concerts', 'festivals', 'blues', 'jazz', 'musica'] ) ) {
        $cta_text = 'Tens un concert o festival? Fem les fotos.';
        $cta_url  = 'https://pocallum.cat/serveis/concerts/';
    } elseif ( has_category( ['teatre', 'dansa', 'performance'] ) ) {
        $cta_text = 'Arts escèniques documentades amb precisió.';
        $cta_url  = 'https://pocallum.cat/serveis/teatre-dansa/';
    }
    
    $cta = '<div class="poca-cta-post">
        <span class="poca-cta-label">Pocallum · Fotografia Cultural</span>
        <p>' . esc_html($cta_text) . '</p>
        <a href="' . esc_url($cta_url) . '" target="_blank" rel="noopener">
            Parlem-ne a pocallum.cat →
        </a>
    </div>';
    
    return $content . $cta;
}
```

**Tasca 2.3 — CSS del CTA post (afegir al child theme style.css)**

```css
.poca-cta-post {
  background: #0d0d0d;
  border: 1px solid #1c1c1c;
  border-left: 4px solid #FF5500;
  padding: 1.5rem 2rem;
  margin: 2rem 0;
  border-radius: 2px;
}
.poca-cta-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #FF5500;
  font-weight: bold;
}
.poca-cta-post p {
  color: #f0f0f0;
  font-size: 1rem;
  margin: 0.5rem 0 1rem;
}
.poca-cta-post a {
  color: #FF5500;
  font-weight: bold;
  text-decoration: none;
}
.poca-cta-post a:hover { text-decoration: underline; }
```

---

### Fase 3 — Barra de temporada (opcional, durant festivals) (1h)

Activar via plugin "Insert Headers and Footers" (gratuït):

```html
<div id="poca-topbar" style="background:#FF5500;color:#fff;text-align:center;padding:8px;font-size:14px;position:relative;">
  📷 Cobertura fotogràfica del <strong>Blues de Barcelona</strong> — 
  <a href="https://pocallum.cat/festivals/festival-de-blues-de-barcelona/" 
     style="color:#fff;font-weight:bold;text-decoration:underline;">veure galeria</a>
  <button onclick="this.parentNode.style.display='none'" 
          style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:#fff;font-size:18px;cursor:pointer;">×</button>
</div>
```

Activar només durant el festival. Desactivar quan acabi.

---

### Fase 4 — Mesura de resultats (continu)

1. Afegir paràmetre UTM als links: `https://pocallum.cat/serveis/?utm_source=blog&utm_medium=cta&utm_campaign=sidebar`
2. Seguiment via GoatCounter a pocallum.cat: filtrar per referrer `blog.pocallum.cat`
3. Revisar cada 3 mesos si hi ha traffic provinent del blog

---

## 6. Recursos necessaris

| Recurs | Detall |
|--------|--------|
| Accés WP Admin | `blog.pocallum.cat/wp-admin` (ja el tens) |
| Accés FTP/SFTP | Per crear child theme (LinuxBCN VPS) |
| Temps total | **4-7 hores** (un dissabte o dues tardes) |
| Coneixements | PHP bàsic, CSS, WP Admin |
| Plugins de pagament | Cap (tot amb funcionalitats natives o plugins gratuïts) |
| Cost econòmic | 0€ |

### Detall de temps per fase

| Fase | Temps estimat |
|------|---------------|
| 0 — Diagnosi i backup | 30 min |
| 1 — Widget sidebar | 1-2h |
| 2 — CTA post-contingut | 2-3h |
| 3 — Barra temporal (opcional) | 1h |
| **Total** | **4-6.5h** |

---

## 7. Paga la pena?

### Arguments a favor

**El contingut ja existeix.** 2.339 articles publicats en 16 anys. El tràfic orgànic és acumulat i gratuït. Afegir un CTA és aprofitar un actiu que ja funciona sol.

**Alineació perfecta de públic.** Les persones que llegeixen sobre el Blues de Barcelona o el VijazZ o fotografia analògica a Nou Barris són exactament el perfil de client de Pocallum: organitzadors, músics, gestors culturals, artistes.

**Cost marginal molt baix.** Un cop implementat, el CTA treballa sol. No cal manteniment. No cal renovar cap subscripció.

**Comparació esforç/retorn.** Si en un any el blog genera 2 consultes noves gràcies al CTA, i es tanca 1, és probablement 400-800€ de feina. L'esforç d'implementació (4-7h) no es repeteix.

### Arguments en contra / riscos

**El blog pot tenir poc tràfic actiu.** No tenim les dades de visitants del blog. Si la majoria del tràfic prové de xarxes socials en el moment de publicació i no de cerca orgànica, l'impacte serà menor.

**Risc d'interferir amb l'experiència del blog.** Si els CTAs semblen spam o trenquen el to del blog, pot ser contraproduent. Solució: disseny integrat i copy amb la mateixa veu.

**No resol el problema de conversió de pocallum.cat.** El CTA porta gent a pocallum.cat, però si aquesta té dificultats per contactar o no s'inspira confiança, el bridge no tanca la venda.

### Veredicte

**Sí, val la pena fer-ho.** L'esforç és baix, el cost és zero, el risc és mínim i el potencial és real. La pregunta no és *si* s'ha de fer, sinó *fins on* arribar. Recomanació:

- **Mínim viable:** Fase 1 (widget sidebar). 1-2h. Impacte immediat, risc zero.
- **Implementació completa:** Fases 1+2. 4-5h. Impacte màxim per esforç raonable.
- **Opcional estratègic:** Fase 3 durant festivals. Activa/desactiva quan convingui.

---

## 8. Notes tècniques addicionals

### Sobre el child theme

Si el tema del blog rep updates automàtiques, **qualsevol canvi a `functions.php` del tema pare es perd**. El child theme és obligatori per a qualsevol modificació PHP que vulguis conservar.

Si ja existeix un child theme (comprova a WP Admin → Aparença → Temes), treballar directament sobre ell.

### Sobre els UTM

Sempre afegir `?utm_source=blog&utm_medium=cta&utm_campaign=FASE` als links dels CTAs. Permet saber exactament quant tràfic genera el blog i quin tipus de CTA converteix millor.

### Sobre el copy

El copy dels CTAs ha de respectar la veu de Pocallum: directe, sense màrqueting genèric, fets concrets. Evitar:
- "Fotògrafs professionals de qualitat"
- "El teu fotògraf de confiança"
- "Contacta'ns per a un pressupost sense compromís"

Preferir:
- "Fas festivals. Fem les fotos."
- "16 anys a la primera fila. Parlem."
- "Si necessites un fotògraf que entengui la música, ja saps on som."

---

## 9. Passos immediats (quan t'aixequis)

1. **Entra al WP Admin** del blog i comprova quin tema és actiu.
2. **Fes un backup** de `functions.php` i `style.css` del tema actual.
3. **Crea o verifica** que existeix un child theme.
4. **Implementa la Fase 1** (widget sidebar): és la ràpida i sense risc.
5. Prova el resultat en mòbil i escriptori.
6. Si tot va bé, implementa la Fase 2 (post-contingut).

---

*Spec aprovat per implementar. Proper pas: escriure el pla d'implementació (writing-plans skill).*
