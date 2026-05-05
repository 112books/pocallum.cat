#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════
#  Pocallum — Script de deploy i gestió
#  Ús: ./sync-pocallum.sh
# ═══════════════════════════════════════════════════════════════════════

set -euo pipefail

# ── Variables ────────────────────────────────────────────────────────────
REMOTE="origin"
BUILD_DIR="public"
BRANCH_STAGING="develop"
BRANCH_PROD="main"
REPO_STAGING="https://112books.github.io/pocallum.cat/"
REPO_PROD="https://pocallum.cat/"

# VPS Dinahosting — omplir quan estigui a punt
SSH_USER=""
SSH_HOST="pocallum.cat"
SSH_PATH="/home/pocallum/www/"

# ── Colors i helpers ─────────────────────────────────────────────────────
RED='\033[0;31m'
GRN='\033[0;32m'
YLW='\033[1;33m'
BLU='\033[0;34m'
DIM='\033[2m'
RST='\033[0m'

print() { echo -e "${BLU}▶${RST} $1"; }
ok()    { echo -e "${GRN}✓${RST} $1"; }
err()   { echo -e "${RED}✗ Error:${RST} $1" >&2; }
warn()  { echo -e "${YLW}⚠${RST}  $1"; }
dim()   { echo -e "${DIM}  $1${RST}"; }

get_baseurl() {
  case "$(git branch --show-current)" in
    main)    echo "$REPO_PROD" ;;
    develop) echo "$REPO_STAGING" ;;
    *)       echo "http://localhost:1313/" ;;
  esac
}

require_clean() {
  if ! git diff --quiet || ! git diff --cached --quiet; then
    err "Hi ha canvis sense confirmar. Fes commit abans de desplegar."
    echo ""
    git status --short
    echo ""
    exit 1
  fi
}

require_vps() {
  if [[ -z "$SSH_USER" ]]; then
    err "VPS no configurat. Edita SSH_USER a sync-pocallum.sh."
    exit 1
  fi
}

# ── Funcions ──────────────────────────────────────────────────────────────

status() {
  echo ""
  CURRENT=$(git branch --show-current)
  print "Branca actual: ${YLW}${CURRENT}${RST}"
  echo ""
  git status --short
  echo ""
  dim "Últims commits:"
  git log --oneline -5
  echo ""
}

sync() {
  CURRENT=$(git branch --show-current)
  print "Sincronitzant amb ${REMOTE}/${CURRENT}..."

  git add -A

  if ! git diff --cached --quiet; then
    read -r -p "  Missatge de commit: " msg
    [[ -z "$msg" ]] && msg="Auto-sync $(date '+%Y-%m-%d %H:%M')"
    git commit -m "$msg"
  fi

  git pull --rebase "$REMOTE" "$CURRENT" || {
    err "Pull/rebase fallat. Resol els conflictes manualment i torna a executar."
    exit 1
  }

  git push "$REMOTE" "$CURRENT" || exit 1
  ok "Sync complet → ${REMOTE}/${CURRENT}"
}

server_local() {
  print "Arrancant servidor local..."
  dim "http://localhost:1313  —  Ctrl+C per aturar"
  echo ""
  hugo server -D
}

build_local() {
  print "Build local (amb drafts)..."
  hugo --minify --buildDrafts || exit 1
  ok "Build correcte → ./${BUILD_DIR}/"
}

deploy_staging() {
  require_clean
  CURRENT=$(git branch --show-current)
  if [[ "$CURRENT" != "$BRANCH_STAGING" ]]; then
    warn "No estàs a '${BRANCH_STAGING}'. Canviant..."
    git checkout "$BRANCH_STAGING"
  fi
  print "Build staging..."
  hugo --minify --baseURL "$REPO_STAGING" --buildDrafts
  ok "Build correcte"
  print "Pujant a GitHub (branca ${BRANCH_STAGING})..."
  dim "El GitHub Action s'encarregarà del deploy + staticrypt (password: LinuxBCN2026)."
  git push "$REMOTE" "$BRANCH_STAGING" || exit 1
  ok "Deploy staging iniciat → ${REPO_STAGING}"
  dim "Segueix el progrés: https://github.com/112books/pocallum.cat/actions"
}

deploy_prod_pages() {
  require_clean
  CURRENT=$(git branch --show-current)
  if [[ "$CURRENT" != "$BRANCH_PROD" ]]; then
    warn "No estàs a '${BRANCH_PROD}'."
    read -r -p "  Vols fer merge de ${BRANCH_STAGING} → ${BRANCH_PROD}? [s/N] " confirm
    if [[ "$confirm" =~ ^[Ss]$ ]]; then
      git checkout "$BRANCH_PROD"
      print "Fent merge de ${BRANCH_STAGING}..."
      git merge "$BRANCH_STAGING" --no-edit || {
        err "Merge fallat. Resol els conflictes manualment."
        exit 1
      }
    else
      err "Opera des de la branca ${BRANCH_PROD} o confirma el merge."
      exit 1
    fi
  fi
  print "Pujant a GitHub (branca ${BRANCH_PROD})..."
  dim "El GitHub Action construirà i desplegarà a GitHub Pages."
  git push "$REMOTE" "$BRANCH_PROD" || exit 1
  ok "Deploy producció iniciat → GitHub Pages"
  dim "Segueix el progrés: https://github.com/112books/pocallum.cat/actions"
  dim "(Quan el domini apunti a Dinahosting, usa l'opció 7 per al deploy final.)"
}

check_dns() {
  print "Comprovant DNS de pocallum.cat..."
  echo ""
  dim "IPs esperades de GitHub Pages:"
  dim "  185.199.108.153  185.199.109.153  185.199.110.153  185.199.111.153"
  echo ""
  dim "IPs actuals:"
  dig +short pocallum.cat A | sort || echo "  (dig no disponible)"
  echo ""
  dim "CNAME www:"
  dig +short www.pocallum.cat CNAME || echo "  (dig no disponible)"
  echo ""
  warn "Per activar el domini: configura els registres A a Dinahosting i afegeix"
  warn "el Custom Domain 'pocallum.cat' a GitHub → Settings → Pages."
}

nova_foto() {
  read -r -p "  Slug de la foto (ex: 2026-05-jazz-jamboree): " slug
  if [[ -z "$slug" ]]; then err "El slug no pot estar buit."; exit 1; fi
  CURRENT=$(git branch --show-current)
  LANG="ca"
  hugo new content "${LANG}/galeria/${slug}.md"
  ok "Creat: content/${LANG}/galeria/${slug}.md"
  dim "Recorda afegir la imatge a: static/images/galeria/${slug}.jpg"
}

nova_noticia() {
  read -r -p "  Slug de la notícia (ex: 2026-05-nova-col-laboracio): " slug
  if [[ -z "$slug" ]]; then err "El slug no pot estar buit."; exit 1; fi
  CURRENT=$(git branch --show-current)
  LANG="ca"
  hugo new content "${LANG}/noticies/${slug}.md"
  ok "Creat: content/${LANG}/noticies/${slug}.md"
  dim "Recorda afegir la imatge a: static/images/noticies/${slug}.jpg"
}

# ── Menú ──────────────────────────────────────────────────────────────────

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Pocallum — Deploy & Gestió"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
CURRENT=$(git branch --show-current 2>/dev/null || echo "?")
echo -e " Branca: ${YLW}${CURRENT}${RST}"
echo ""
echo " 1) Status del repo"
echo " 2) Sync  (commit + pull --rebase + push)"
echo " 3) Servidor local  →  localhost:1313"
echo " 4) Build local (amb drafts)"
echo "───────────────────────────────────────"
echo " 5) Deploy staging  →  GitHub Pages (develop + staticrypt)"
echo " 6) Deploy producció → GitHub Pages (main)"
echo " 7) Estat del DNS (comprova si pocallum.cat apunta a GitHub Pages)"
echo "───────────────────────────────────────"
echo " f) Nova fotografia de galeria"
echo " n) Nova notícia"
echo "───────────────────────────────────────"
echo " 0) Sortir"
echo ""

read -r -p "Opció: " opt
echo ""

case $opt in
  1) status ;;
  2) sync ;;
  3) server_local ;;
  4) build_local ;;
  5) deploy_staging ;;
  6) deploy_prod_pages ;;
  7) check_dns ;;
  f) nova_foto ;;
  n) nova_noticia ;;
  0) exit 0 ;;
  *) err "Opció no vàlida: '${opt}'"; exit 1 ;;
esac

echo ""
