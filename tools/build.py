#!/usr/bin/env python3
"""Bundelt index.html, CSS en JS tot één zelfstandig HTML-bestand.

    python3 tools/build.py                 -> dist/jobwijs.html (openen met dubbelklik, mailen, ...)
    python3 tools/build.py --fragment OUT  -> zonder <html>/<head>/<body>, voor publicatie als Claude-artifact
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def bundle() -> str:
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    css = (ROOT / "css/styles.css").read_text(encoding="utf-8")
    html = html.replace('<link rel="stylesheet" href="css/styles.css">', "<style>\n" + css + "</style>")
    for src in re.findall(r'<script src="(js/[^"]+)"></script>', html):
        js = (ROOT / src).read_text(encoding="utf-8")
        html = html.replace(f'<script src="{src}"></script>', "<script>\n" + js + "</script>")
    return html


def fragment(html: str) -> str:
    head = re.search(r"<head>(.*?)</head>", html, re.S).group(1)
    body = re.search(r"<body>(.*?)</body>", html, re.S).group(1)
    head = re.sub(r'<meta (charset|name="viewport")[^>]*>\n?', "", head)
    title = re.search(r"<title>.*?</title>\n?", head).group(0)
    head = head.replace(title, "")
    return title + head + body


if __name__ == "__main__":
    html = bundle()
    if len(sys.argv) == 3 and sys.argv[1] == "--fragment":
        Path(sys.argv[2]).write_text(fragment(html), encoding="utf-8")
        print("fragment ->", sys.argv[2])
    else:
        out = ROOT / "dist/jobwijs.html"
        out.parent.mkdir(exist_ok=True)
        out.write_text(html, encoding="utf-8")
        print("bundel ->", out.relative_to(ROOT))
