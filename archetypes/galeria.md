---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
servei: "cultura"    # cultura | artistes | empreses
image: "/images/galeria/{{ .File.ContentBaseName }}.jpg"
draft: true
---
