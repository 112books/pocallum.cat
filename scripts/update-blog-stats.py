#!/usr/bin/env python3
"""
Fetch live stats from blog.pocallum.cat (WordPress REST API)
and update content/ca/blog/_index.md + content/en/blog/_index.md.
"""
import re
import sys
import requests

BASE = "https://blog.pocallum.cat/wp-json/wp/v2"
TIMEOUT = 30


def get_total(endpoint, params=""):
    url = f"{BASE}/{endpoint}?per_page=1&{params}"
    r = requests.get(url, timeout=TIMEOUT)
    r.raise_for_status()
    return int(r.headers["X-WP-Total"])


def count_words():
    total = 0
    page = 1
    while True:
        r = requests.get(
            f"{BASE}/posts",
            params={"per_page": 100, "page": page, "_fields": "content", "status": "publish"},
            timeout=60,
        )
        if r.status_code == 400:
            break
        r.raise_for_status()
        posts = r.json()
        if not posts:
            break
        for post in posts:
            html = post.get("content", {}).get("rendered", "")
            text = re.sub(r"<[^>]+>", " ", html)
            total += len(text.split())
        page += 1
    return total


def fmt_ca(n):
    return f"{n:,}".replace(",", ".")


def fmt_en(n):
    return f"{n:,}"


def update_stat(content, label, num, fmt_num):
    pattern = (
        r'\{\s*num:\s*"[^"]*",\s*label:\s*"'
        + re.escape(label)
        + r'",\s*raw:\s*\d+\s*\}'
    )
    replacement = f'{{ num: "{fmt_num}", label: "{label}", raw: {num} }}'
    new = re.sub(pattern, replacement, content)
    if new == content:
        print(f"  WARN: label '{label}' not found", file=sys.stderr)
    return new


def update_file(path, stats_ca_labels, stats):
    """
    stats: dict with keys: posts, words, categories, tags, comments
    stats_ca_labels: True if file uses CA labels (paraules, etiquetes, comentaris)
    """
    with open(path) as f:
        content = f.read()

    if stats_ca_labels:
        label_map = {
            "posts": ("posts", fmt_ca),
            "words": ("paraules", fmt_ca),
            "categories": ("categories", fmt_ca),
            "tags": ("etiquetes", fmt_ca),
            "comments": ("comentaris", fmt_ca),
        }
    else:
        label_map = {
            "posts": ("posts", fmt_en),
            "words": ("words", fmt_en),
            "categories": ("categories", fmt_en),
            "tags": ("tags", fmt_en),
            "comments": ("comments", fmt_en),
        }

    for key, (label, fmt) in label_map.items():
        content = update_stat(content, label, stats[key], fmt(stats[key]))

    with open(path, "w") as f:
        f.write(content)

    print(f"  Updated: {path}")


def main():
    print("Fetching stats from WordPress API...")

    stats = {}

    print("  posts...")
    stats["posts"] = get_total("posts", "status=publish")

    print("  categories...")
    stats["categories"] = get_total("categories")

    print("  tags...")
    stats["tags"] = get_total("tags")

    print("  comments...")
    stats["comments"] = get_total("comments")

    print("  words (paginating all posts)...")
    stats["words"] = count_words()

    print(f"\nStats: {stats}\n")

    update_file("content/ca/blog/_index.md", True, stats)
    update_file("content/en/blog/_index.md", False, stats)

    print("Done.")


if __name__ == "__main__":
    main()
