"""Fetch WeChat articles via requests with mobile headers, extract via trafilatura."""

import re
import json
import time
import sys
from pathlib import Path

import requests
import trafilatura

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Mobile Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Cache-Control": "no-cache",
}


def sanitize_filename(title: str, max_len: int = 80) -> str:
    title = title.strip()
    title = re.sub(r'[\\/:*?"<>|]', '-', title)
    title = re.sub(r'\s+', ' ', title)
    if len(title) > max_len:
        title = title[:max_len].rsplit(' ', 1)[0]
    return title.strip() or "untitled"


def extract_title(html):
    """Extract the real article title using multiple strategies."""
    # Strategy 1: og:title (most reliable for WeChat)
    m = re.search(r'og:title"\s+content="([^"]+)"', html)
    if m:
        title = m.group(1).strip()
        if title not in ("微信公众平台", "环境异常"):
            return title

    # Strategy 2: WeChat's activity-name h1
    m = re.search(r'id="activity-name"[^>]*>([^<]+)<', html)
    if m:
        title = m.group(1).strip()
        if title:
            return title

    # Strategy 3: rich_media_title
    m = re.search(r'rich_media_title[^>]*>([^<]+)<', html)
    if m:
        title = m.group(1).strip()
        if title:
            return title

    # Strategy 4: <title> tag
    m = re.search(r'<title>([^<]+)</title>', html)
    if m:
        title = m.group(1).strip()
        title = re.sub(r'\s*[|_-]\s*.*$', '', title)
        if title not in ("微信公众平台", "环境异常"):
            return title

    return None


def safe_print(*args, **kwargs):
    """Print safely, replacing unencodable characters for Windows console."""
    try:
        print(*args, **kwargs)
    except UnicodeEncodeError:
        text = ' '.join(str(a) for a in args)
        text = text.encode('ascii', errors='replace').decode('ascii')
        print(text, **kwargs)


def main():
    links_path = Path("links.md")
    if not links_path.exists():
        safe_print(f"[ERROR] {links_path} not found")
        sys.exit(1)

    urls = []
    seen = set()
    with open(links_path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            match = re.search(r'https?://\S+', line)
            if match:
                url = match.group()
                if url not in seen:
                    urls.append(url)
                    seen.add(url)

    safe_print(f"Found {len(urls)} URLs ({len(seen)} unique)\n")

    out_dir = Path("articles")
    out_dir.mkdir(exist_ok=True)

    # Clear previous files
    for old in out_dir.glob("*.md"):
        old.unlink()

    session = requests.Session()
    session.headers.update(HEADERS)

    for i, url in enumerate(urls, start=1):
        num = f"{i:02d}"
        safe_print(f"[{num}/{len(urls)}] {url}", end=" ", flush=True)

        try:
            resp = session.get(url, timeout=30)
            resp.raise_for_status()
        except Exception as e:
            safe_print(f"-> [SKIP] HTTP error: {e}")
            continue

        html = resp.text

        # Check for anti-bot page
        if "异常" in html[:5000] and "验证" in html[:5000]:
            safe_print(f"-> [SKIP] anti-bot verification page")
            continue

        # Check for "continue" interstitial
        if "继续访问" in html[:10000] or "请确认" in html[:10000]:
            safe_print(f"-> [SKIP] 'continue access' interstitial")
            continue

        # Extract with trafilatura
        result = trafilatura.extract(html, output_format="markdown", with_metadata=True)
        if not result:
            safe_print(f"-> [SKIP] empty extraction")
            continue

        title = extract_title(html) or f"article_{num}"
        filename = sanitize_filename(title) + f"_{num}.md"
        filepath = out_dir / filename

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(f"# {title}\n\n")
            f.write(f"> 原文: {url}\n\n")
            f.write(result)

        size_kb = len(result.encode("utf-8")) / 1024
        safe_print(f"-> {filename} ({size_kb:.1f} KB)")

        # Be gentle to the server
        if i < len(urls):
            time.sleep(3)

    # Summary
    count = len(list(out_dir.glob("*.md")))
    safe_print(f"\nDone! {count}/{len(urls)} articles saved to {out_dir.resolve()}/")


if __name__ == "__main__":
    main()
