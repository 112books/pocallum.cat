import pathlib

# ── selector d'idioma: sempre tots els idiomes, amb la portada si no hi ha traducció ──
h = pathlib.Path("themes/pocallum/layouts/partials/header.html")
s = h.read_text()
old = s[s.find('      <div class="nav-langs"'):]
old = old[:old.find('</div>') + len('</div>')]
new = '''      <div class="nav-langs" aria-label="{{ i18n "lang_switcher" | default "Canvi d'idioma" }}">
        {{- $tr := dict -}}
        {{- range .AllTranslations -}}{{- $tr = merge $tr (dict .Language.Lang .RelPermalink) -}}{{- end -}}
        {{- range .Site.Sites -}}
          {{- if not .Language.Disabled -}}
          {{- $lang := .Language.Lang -}}
          {{- $url := or (index $tr $lang) .Home.RelPermalink -}}
          <a href="{{ $url }}"
             class="nav-lang{{ if eq $lang $.Language.Lang }} is-active{{ end }}"
             lang="{{ $lang }}"
             hreflang="{{ $lang }}">
            {{ upper $lang }}
          </a>
          {{- end -}}
        {{- end }}
      </div>'''
s = s.replace(old, new)
h.write_text(s)
print("selector reescrit")

# ── portada ES: estructura i jerarquia ──
tpl = '''{{ define "main" }}
{{- $serveis := where .Site.RegularPages "Section" "serveis" -}}

<section class="page-header">
  <div class="container">
    <p class="page-eyebrow">{{ i18n "serveis_eyebrow" }}</p>
    <h1 class="page-title">{{ .Title }}</h1>
    <p class="page-intro">{{ .Params.lead | default (i18n "serveis_intro") }}</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2 class="section-title">{{ i18n "section_serveis_title" }}</h2>
    <div class="servei-llista">
      {{ range $i, $s := $serveis }}
      <article class="servei-llista__item">
        <span class="servei-llista__num">{{ printf "%02d" (add $i 1) }}</span>
        <div class="servei-llista__body">
          <h3 class="servei-llista__title">
            <a href="{{ $s.RelPermalink }}">{{ $s.Title }}</a>
          </h3>
          <p class="servei-llista__desc">{{ $s.Description }}</p>
          <a class="servei-llista__cta" href="{{ $s.RelPermalink }}">{{ i18n "serveis_chapter_cta" }}</a>
        </div>
      </article>
      {{ end }}
    </div>
  </div>
</section>

{{ with .Content }}
<section class="section section--alt">
  <div class="container container--narrow">
    <div class="prose">{{ . }}</div>
  </div>
</section>
{{ end }}

{{ partial "cta-band.html" . }}
{{ end }}
'''
pathlib.Path("themes/pocallum/layouts/index.es.html").write_text(tpl)

css = pathlib.Path("themes/pocallum/assets/css/main.css")
css.write_text(css.read_text() + '''
/* ── Llistat de serveis (portada ES) ───────────────────────────────── */
.servei-llista { display: flex; flex-direction: column; gap: 2.5rem; margin-top: 2.5rem; }
.servei-llista__item {
  display: grid; grid-template-columns: 3.5rem 1fr; gap: 1.25rem;
  padding-bottom: 2.5rem; border-bottom: 1px solid var(--line);
}
.servei-llista__num {
  font-family: var(--f-mono); font-size: .85rem; letter-spacing: .1em;
  color: var(--mid); padding-top: .45rem;
}
.servei-llista__title { margin: 0 0 .6rem; font-size: clamp(1.35rem, 3vw, 2rem); line-height: 1.15; }
.servei-llista__title a { color: var(--fg); text-decoration: none; }
.servei-llista__title a:hover { color: var(--accent); }
.servei-llista__desc { margin: 0 0 1rem; color: var(--mid); max-width: 62ch; line-height: 1.6; }
.servei-llista__cta {
  display: inline-block; color: var(--accent); text-decoration: none;
  font-family: var(--f-mono); font-size: .82rem; letter-spacing: .08em;
  border-bottom: 1px solid transparent; padding-bottom: .15rem;
}
.servei-llista__cta:hover { border-color: var(--accent); }
.servei-llista__item:last-child { border-bottom: 0; padding-bottom: 0; }
@media (max-width: 640px) {
  .servei-llista__item { grid-template-columns: 1fr; gap: .5rem; }
  .servei-llista__num { padding-top: 0; }
}
''')
print("portada ES i CSS escrits")
