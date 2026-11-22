import pathlib, re

# ── header.html ─────────────────────────────────────────────
h = pathlib.Path("themes/pocallum/layouts/partials/header.html")
s = h.read_text()
s = s.replace("{{ $lp := $.Site.LanguagePrefix }}",
              "{{ $lp := $.Site.LanguagePrefix }}\n{{ $es := eq .Language.Lang \"es\" }}")
s = s.replace('<a href="{{ .URL | relLangURL }}"',
              '<a href="{{ if .Params.no_lang }}{{ .URL }}{{ else }}{{ .URL | relLangURL }}{{ end }}"')
s = s.replace('<a href="{{ "cerca/" | relLangURL }}" class="nav-search-btn"',
              '<a href="{{ if $es }}/cerca/{{ else }}{{ "cerca/" | relLangURL }}{{ end }}" class="nav-search-btn"')
h.write_text(s)
print("header ok")

# ── footer.html ─────────────────────────────────────────────
f = pathlib.Path("themes/pocallum/layouts/partials/footer.html")
t = f.read_text()
t = t.replace('<footer class="site-footer">', '<footer class="site-footer">\n  {{ $es := eq .Language.Lang "es" }}')
t = t.replace('<a href="{{ .URL | relLangURL }}" class="footer-nav-link">',
              '<a href="{{ if .Params.no_lang }}{{ .URL }}{{ else }}{{ .URL | relLangURL }}{{ end }}" class="footer-nav-link">')
t = t.replace('<a href="{{ "noticies/index.xml" | relLangURL }}"',
              '<a href="{{ if $es }}/noticies/index.xml{{ else }}{{ "noticies/index.xml" | relLangURL }}{{ end }}"')
t = t.replace('<a href="{{ "cerca/" | relLangURL }}" class="footer-social-link"',
              '<a href="{{ if $es }}/cerca/{{ else }}{{ "cerca/" | relLangURL }}{{ end }}" class="footer-social-link"')
f.write_text(t)
print("footer ok")

# ── hugo.toml: menú ES amb rutes explícites ─────────────────
cfg = pathlib.Path("hugo.toml")
c = cfg.read_text()
start = c.find("[[languages.es.menus.main]]")
if start != -1:
    c = c[:start].rstrip() + "\n"
items = [("Servicios", "/es/serveis/", 1), ("Galería", "/galeria/", 2), ("Festivales", "/festivals/", 3),
         ("Noticias", "/noticies/", 4), ("Blog", "/el-blog/", 5), ("Quiénes somos", "/qui-som/", 6)]
bloques = []
for name, url, w in items:
    bloques.append('[[languages.es.menus.main]]\n  name   = "%s"\n  url    = "%s"\n  weight = %d\n  [languages.es.menus.main.params]\n    no_lang = true\n' % (name, url, w))
bloques.append('[[languages.es.menus.main]]\n  name   = "Contacto"\n  url    = "/es/contacte/"\n  weight = 7\n  [languages.es.menus.main.params]\n    no_lang   = true\n    highlight = true\n')
cfg.write_text(c.rstrip() + "\n\n" + "\n".join(bloques))
print("menus ES reescrits")

# ── translationKey a portada i seccions ─────────────────────
def add_tk(path, key):
    p = pathlib.Path(path)
    s = p.read_text()
    if "translationKey:" in s:
        print("  ja té key:", path); return
    if s.startswith("---"):
        s = s.replace("---", "---\ntranslationKey: " + key, 1)
    else:
        s = "---\ntranslationKey: " + key + "\n---\n\n" + s
    p.write_text(s)
    print("  ", path, "→", key)

add_tk("content/ca/_index.md", "home")
add_tk("content/en/_index.md", "home")
add_tk("content/ca/serveis/_index.md", "serveis")
add_tk("content/en/serveis/_index.md", "serveis")
add_tk("content/ca/contacte/_index.md", "contacte")
add_tk("content/en/contacte/_index.md", "contacte")
