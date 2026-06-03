---
title: "{{ replace .Name "-" " " | title }}"
subtitle: ""
tipus: "fotollibre"
any: {{ now.Year }}
rol: "fotografia"
artista: ""
editorial: ""
web: ""
image: "/images/obra/{{ .Name }}.jpg"
destacat: false
date: {{ .Date }}
draft: true
---
