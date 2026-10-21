#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Genera les propostes per artista (MD + PDF) en CA i, si cal, ES.
Ús: python3 _build.py
"""
import os, shutil, subprocess, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))

TPL = {
    "ca": open(os.path.join(HERE, "_plantilla-ca.md"), encoding="utf-8").read(),
    "es": open(os.path.join(HERE, "_plantilla-es.md"), encoding="utf-8").read(),
}

DISTRICTE = "https://blog.pocallum.cat/2026/10/19/2026-10-18-ciutat-flamenco-districte-flamenco/"
ESPERANZA = "https://blog.pocallum.cat/2026/10/18/2026-10-19-ciutat-flamenco-esperanza-garrido-firmamento/"

ARTISTES = [
    dict(slug="adrian-gomez", nom="Adrián Gómez", obra="Cara A y Cara B",
         data="18 d'octubre de 2026", lloc="Nau Bostik, Barcelona", link=DISTRICTE,
         to="fred", langs=["ca", "es"]),
    dict(slug="daniela-martin-heras", nom="Daniela Martín Heras", obra="A la sombra de un poeta",
         data="18 d'octubre de 2026", lloc="Nau Bostik, Barcelona", link=DISTRICTE,
         to="fred", langs=["ca"]),
    dict(slug="marina-walpercin", nom="Marina Walpercin", obra="De tu libertad",
         data="18 d'octubre de 2026", lloc="Nau Bostik, Barcelona", link=DISTRICTE,
         to="calid", langs=["ca"]),
    dict(slug="esperanza-garrido", nom="Esperanza Garrido", obra="Firmamento",
         data="18 d'octubre de 2026", lloc="Nau Bostik, Barcelona", link=ESPERANZA,
         to="fred", langs=["ca"]),
]

CSS = """
@font-face { font-family:'Syne'; src:url('file://%(r)s/static/fonts/Syne-Bold.ttf'); font-weight:700; }
@font-face { font-family:'Plex'; src:url('file://%(r)s/static/fonts/IBMPlexSans-Regular.ttf'); font-weight:400; }
@font-face { font-family:'Plex'; src:url('file://%(r)s/static/fonts/IBMPlexSans-SemiBold.ttf'); font-weight:600; }
@font-face { font-family:'PlexC'; src:url('file://%(r)s/static/fonts/IBMPlexSans_Condensed-Medium.ttf'); font-weight:500; }
@font-face { font-family:'Chicago'; src:url('file://%(r)s/static/fonts/ChicagoFLF.ttf'); }
@page { size: A4; margin: 20mm 19mm 18mm 19mm;
  @bottom-left { content: "pocallum.cat"; font-family:'PlexC'; font-size:8pt; color:#999; }
  @bottom-right { content: "Ciutat Flamenco 2026 · " counter(page) "/" counter(pages); font-family:'PlexC'; font-size:8pt; color:#999; } }
body { font-family:'Plex', sans-serif; font-size:10.2pt; line-height:1.55; color:#141414; margin:0; }
.marca { font-family:'Chicago'; font-size:15pt; margin:0 0 2mm 0; }
.marca i { color:#FF5500; font-style:normal; }
.regla { height:3px; background:#FF5500; width:28mm; margin:0 0 8mm 0; }
h1 { font-family:'Syne'; font-weight:700; font-size:23pt; line-height:1.08; letter-spacing:-.02em; margin:0 0 3mm 0; color:#000; }
h2 { font-family:'Syne'; font-weight:700; font-size:13pt; margin:9mm 0 3mm 0; color:#000; page-break-after:avoid; }
h3 { font-family:'PlexC'; font-weight:500; font-size:8.6pt; letter-spacing:.12em; text-transform:uppercase; color:#FF5500; margin:6mm 0 2mm 0; page-break-after:avoid; }
p { margin:0 0 3.2mm 0; }
ul, ol { margin:0 0 3.5mm 0; padding-left:5mm; }
li { margin:0 0 1.6mm 0; }
strong { font-weight:600; }
h1 + p { font-family:'PlexC'; font-weight:500; font-size:8.6pt; letter-spacing:.12em; text-transform:uppercase; color:#FF5500; margin:0 0 9mm 0; }
a { color:#000; text-decoration:none; border-bottom:.5pt solid #FF5500; word-break:break-all; }
"""

HTML = """<!doctype html><html lang="%(l)s"><head><meta charset="utf-8"><title>%(t)s</title><style>%(c)s</style></head><body>
<div class="marca">POCALLUM<i>.</i></div><div class="regla"></div>%(b)s</body></html>"""

TITOL = {"ca": "Proposta de fotografia d'actuació", "es": "Propuesta de fotografía de actuación"}

def build(a, lang):
    data = a["data"] if lang == "ca" else a["data"].replace("d'octubre", "de octubre")
    md = (TPL[lang].replace("{{ARTISTA}}", a["nom"])
                     .replace("{{ESPECTACLE}}", a["obra"])
                     .replace("{{DATA}}", data)
                     .replace("{{LLOC}}", a["lloc"]))
    stem = a["slug"] + ("" if lang == "ca" else "-es")
    md_path = os.path.join(HERE, stem + ".md")
    open(md_path, "w", encoding="utf-8").write(md)

    tmp = tempfile.mkdtemp()
    body = os.path.join(tmp, "body.html")
    subprocess.run(["pandoc", md_path, "-f", "markdown", "-t", "html5", "-o", body], check=True)
    html_doc = HTML % dict(l=lang,
                           t=TITOL[lang] + " — " + a["nom"],
                           c=CSS % dict(r=ROOT),
                           b=open(body, encoding="utf-8").read())
    html_path = os.path.join(tmp, "doc.html")
    open(html_path, "w", encoding="utf-8").write(html_doc)
    pdf_path = os.path.join(HERE, stem + ".pdf")
    subprocess.run(["weasyprint", html_path, pdf_path], check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    shutil.rmtree(tmp)
    return md_path, pdf_path

MISSATGE_CALID = """Hola, {primer}! Ja soc aquí 🙂 He preparat una selecció àmplia de les teves fotografies de «{obra}», a Ciutat Flamenco. Et proposo dues opcions:

— 10 fotografies editades: 200 €
— Galeria completa, fins a 100 editades: 350 €

Inclou llicència per fer-les servir a les teves xarxes, web i portfoli, amb menció a @pocallum o pocallum.cat. Altres usos (anuncis, cartelleria, tercers) s'han d'acordar a banda.

Pots veure el passi al blog:
{link}

Si vols mirar-les amb calma, et passo una galeria privada de Google Fotos a 1.000 px.

Quina opció et pot encaixar més?
"""

MISSATGE_FRED = """Bon dia, {primer},

Soc en Joan Linux «Pocallum», fotògraf de cultura en directe i arts escèniques (https://pocallum.cat). Vaig fotografiar «{obra}» al Ciutat Flamenco, a la Nau Bostik, i us vull oferir les imatges de l'actuació.

Dues opcions:
— 10 fotografies editades: 200 €
— Galeria completa, fins a 100 editades: 350 €

Inclou llicència per fer-les servir a les vostres xarxes, web i portfoli, amb menció a @pocallum o pocallum.cat. Altres usos (anuncis, cartelleria, tercers) s'han d'acordar a banda.

Podeu veure el passi al blog:
{link}

Si les voleu mirar amb calma, us passo una galeria privada de Google Fotos a 1.000 px.

Us encaixa alguna opció?

Joan Linux «Pocallum» · pocallum.cat
"""

MISSATGE_FRED_ES = """Buenos días, {primer}:

Soy Joan Linux «Pocallum», fotógrafo de cultura en directo y artes escénicas (https://pocallum.cat). Fotografié «{obra}» en el Ciutat Flamenco, en la Nau Bostik, y le quiero ofrecer las imágenes de la actuación.

Dos opciones:
— 10 fotografías editadas: 200 €
— Galería completa, hasta 100 editadas: 350 €

Incluye licencia para usarlas en sus redes, web y porfolio, con mención a @pocallum o pocallum.cat. Otros usos (anuncios, cartelería, terceros) se acuerdan aparte.

Puede ver el pase al blog:
{link}

Si quiere verlas con calma, le paso una galería privada de Google Fotos a 1.000 px.

¿Le encaja alguna opción?

Joan Linux «Pocallum» · pocallum.cat
"""

if __name__ == "__main__":
    for a in ARTISTES:
        for lang in a["langs"]:
            md, pdf = build(a, lang)
            print("ok", os.path.basename(md), os.path.basename(pdf))

    mdir = os.path.join(HERE, "missatges")
    os.makedirs(mdir, exist_ok=True)
    for a in ARTISTES:
        primer = a["nom"].split()[0]
        for lang in a["langs"]:
            if lang == "es":
                tpl = MISSATGE_FRED_ES
                name = a["slug"] + "-es.md"
            else:
                tpl = MISSATGE_CALID if a.get("to") == "calid" else MISSATGE_FRED
                name = a["slug"] + ".md"
            text = tpl.format(primer=primer, obra=a["obra"], link=a["link"])
            open(os.path.join(mdir, name), "w", encoding="utf-8").write(text)
            print("ok missatges/" + name, len(text), "caràcters")
