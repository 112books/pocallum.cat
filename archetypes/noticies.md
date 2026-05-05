---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
lead: ""
image: "/images/noticies/{{ .File.ContentBaseName }}.jpg"
draft: true
---
