#!/usr/bin/env bash
set -euo pipefail

QUALITY=85
DIRS=(
  "static/images/galeria"
  "static/images/festivals"
  "static/images/noticies"
)
FORCE=0
SINGLE_FILE=""

usage() {
  echo "Ús: $0 [--force] [fitxer.jpg]"
  echo "  --force      Regenera WebP encara que ja existeixi"
  echo "  fitxer.jpg   Converteix un sol fitxer (opcional)"
  exit 1
}

if ! command -v magick &>/dev/null; then
  echo "Error: ImageMagick no trobat. Instal·la amb: brew install imagemagick"
  exit 1
fi

convert_file() {
  local src="$1"
  local base="${src%.*}"
  local webp="${base}.webp"
  local w800="${base}-800.webp"
  local w1600="${base}-1600.webp"

  if [[ $FORCE -eq 1 || ! -f "$webp" || "$src" -nt "$webp" ]]; then
    magick "$src" -quality $QUALITY "$webp"
    echo "  → $webp"
  else
    echo "  skip $webp"
  fi

  if [[ $FORCE -eq 1 || ! -f "$w800" || "$src" -nt "$w800" ]]; then
    magick "$src" -resize '800x>' -quality $QUALITY "$w800"
    echo "  → $w800"
  else
    echo "  skip $w800"
  fi

  if [[ $FORCE -eq 1 || ! -f "$w1600" || "$src" -nt "$w1600" ]]; then
    magick "$src" -resize '1600x>' -quality $QUALITY "$w1600"
    echo "  → $w1600"
  else
    echo "  skip $w1600"
  fi
}

for arg in "$@"; do
  case "$arg" in
    --force) FORCE=1 ;;
    *.jpg|*.jpeg|*.JPG|*.JPEG) SINGLE_FILE="$arg" ;;
    *) usage ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

if [[ -n "$SINGLE_FILE" ]]; then
  [[ -f "$SINGLE_FILE" ]] || { echo "Error: fitxer no trobat: $SINGLE_FILE"; exit 1; }
  echo "Convertint: $SINGLE_FILE"
  convert_file "$SINGLE_FILE"
else
  for dir in "${DIRS[@]}"; do
    full_dir="$REPO_ROOT/$dir"
    if [[ ! -d "$full_dir" ]]; then
      echo "Avís: directori no trobat, saltant: $full_dir"
      continue
    fi
    echo "Processant: $dir"
    find "$full_dir" -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) | sort | while read -r f; do
      convert_file "$f"
    done
  done
fi

echo "Fet."
