import html
import re
import time
from urllib.parse import quote

from features.row_links.formatters import named

CODE_SPAN = re.compile(r"`([^`]+)`")
BOLD = re.compile(r"\*\*(.+?)\*\*")
ITALIC = re.compile(r"(?<![\w*])[*_](?!\s)(.+?)(?<!\s)[*_](?![\w*])")
LINK = re.compile(r"\[([^\]]+)\]\((https?://[^)\s]+)\)")
URL = re.compile(r"(?<![\"'=>])\bhttps?://[^\s<>\"']+[^\s<>\"'.,;:)]")
LIST_ITEM = re.compile(r"^\s*(?:[-*]|(\d+)\.)\s+(.*)$")
HEADING = re.compile(r"^(#{1,4})\s+(.*)$")
FENCES = ("```", "~~~")
PICTURES = (".png", ".jpg", ".jpeg", ".gif", ".webp")


class Page:
    def __init__(self, token: str, scope: set[str]):
        self.token, self.scope = token, scope

    def href(self, ref: str) -> str:
        kind, _, n = ref.partition(":")
        return f"/s/{self.token}/{kind}/{n}"

    def file_href(self, ref: str, name: str) -> str:
        kind, _, n = ref.partition(":")
        return f"/s/{self.token}/files/{kind}/{n}/{quote(name, safe='')}"

    def refs(self, text: str) -> str:
        names, pattern = named()

        def linked(m) -> str:
            ref = f"{names[m.group(1).lower()]}:{m.group(2)}"
            return f'<a href="{self.href(ref)}">{m.group(0)}</a>' if ref in self.scope and not m.group(3) else m.group(0)

        return pattern.sub(linked, text)

    def inline(self, text: str) -> str:
        spans = []

        def kept(m) -> str:
            spans.append(f"<code>{html.escape(m.group(1))}</code>")
            return f"\x00{len(spans) - 1}\x00"

        text = html.escape(CODE_SPAN.sub(kept, text), quote=False)
        text = LINK.sub(lambda m: f'<a href="{html.escape(m.group(2), quote=True)}" rel="noopener noreferrer nofollow" target="_blank">{m.group(1)}</a>', text)
        text = URL.sub(lambda m: f'<a href="{m.group(0)}" rel="noopener noreferrer nofollow" target="_blank">{m.group(0)}</a>', text)
        text = self.refs(ITALIC.sub(r"<em>\1</em>", BOLD.sub(r"<strong>\1</strong>", text)))
        return re.sub("\x00(\\d+)\x00", lambda m: spans[int(m.group(1))], text)

    def markdown(self, text: str) -> str:
        out, lines, i = [], text.replace("\r", "").split("\n"), 0
        while i < len(lines):
            line = lines[i]
            if line.startswith(FENCES):
                fence, body, i = line[:3], [], i + 1
                while i < len(lines) and not lines[i].startswith(fence):
                    body.append(lines[i])
                    i += 1
                out.append(f"<pre><code>{html.escape(chr(10).join(body))}</code></pre>")
                i += 1
                continue
            if not line.strip():
                i += 1
                continue
            heading = HEADING.match(line)
            if heading:
                level = min(6, len(heading.group(1)) + 2)
                out.append(f"<h{level}>{self.inline(heading.group(2))}</h{level}>")
                i += 1
                continue
            if LIST_ITEM.match(line):
                ordered = bool(LIST_ITEM.match(line).group(1))
                items = []
                while i < len(lines) and LIST_ITEM.match(lines[i]):
                    items.append(f"<li>{self.inline(LIST_ITEM.match(lines[i]).group(2))}</li>")
                    i += 1
                tag = "ol" if ordered else "ul"
                out.append(f"<{tag}>{''.join(items)}</{tag}>")
                continue
            if line.startswith(">"):
                quoted = []
                while i < len(lines) and lines[i].startswith(">"):
                    quoted.append(lines[i].lstrip("> "))
                    i += 1
                out.append(f"<blockquote>{self.inline(' '.join(quoted))}</blockquote>")
                continue
            if line.lstrip().startswith("|"):
                rows = []
                while i < len(lines) and lines[i].lstrip().startswith("|"):
                    cells = [c.strip() for c in lines[i].strip().strip("|").split("|")]
                    if not all(set(c) <= set("-: ") for c in cells):
                        rows.append("".join(f"<td>{self.inline(c)}</td>" for c in cells))
                    i += 1
                out.append("<table>" + "".join(f"<tr>{r}</tr>" for r in rows) + "</table>")
                continue
            paragraph = []
            while i < len(lines) and lines[i].strip() and not (lines[i].startswith((*FENCES, ">")) or HEADING.match(lines[i]) or LIST_ITEM.match(lines[i])):
                paragraph.append(lines[i].strip())
                i += 1
            out.append(f"<p>{self.inline(' '.join(paragraph))}</p>")
        return "\n".join(out)

    def row(self, r) -> str:
        ref = f"{r.type}:{r.n}"
        parts = [f"<h1>{html.escape(r.title)}</h1>"]
        if r.abstract:
            parts.append(f'<p class="abstract">{self.inline(r.abstract)}</p>')
        if r.brief:
            parts.append(self.markdown(r.brief))
        for section in r.sections:
            parts.append(f"<h2>{html.escape(section.get('title', ''))}</h2>")
            parts.append(self.markdown(section.get("body", "")))
        pictures = [name for name in r.files if name.lower().endswith(PICTURES)]
        for name in pictures:
            parts.append(f'<figure><img src="{self.file_href(ref, name)}" alt="{html.escape(name, quote=True)}"></figure>')
        others = [name for name in r.files if name not in pictures]
        if others:
            items = "".join(f'<li><a href="{self.file_href(ref, name)}">{html.escape(name)}</a></li>' for name in sorted(others))
            parts.append(f'<h2>Attached files</h2><ul class="files">{items}</ul>')
        return "\n".join(parts)

    def collection(self, c, members: list) -> str:
        cards = "".join(
            f'<li><a href="{self.href(f"{m.type}:{m.n}")}"><strong>{html.escape(m.title)}</strong>'
            f'<span>{html.escape(m.abstract or "")}</span></a></li>' for m in members
        )
        about = f'<p class="abstract">{self.inline(c.abstract)}</p>' if c.abstract else ""
        return f'<h1>{html.escape(c.title)}</h1>{about}<ul class="cards">{cards}</ul>'


def ending(expires: float) -> str:
    if not expires:
        return "View only"
    return f"View only · this link ends {time.strftime('%-d %B %Y', time.localtime(expires))}"


STYLE = """
:root { --bg: #ffffff; --text: #1c1d21; --muted: #6b6f78; --line: #e6e7ea; --accent: #5b5fc7; --code: #f4f4f6; }
@media (prefers-color-scheme: dark) { :root { --bg: #131417; --text: #e8e9ec; --muted: #8b8f98; --line: #26282d; --accent: #a5a8ff; --code: #1c1e22; } }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); font: 16px/1.65 -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif; }
main { max-width: 760px; margin: 0 auto; padding: 48px 20px 80px; }
header.bar { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 36px; color: var(--muted); font-size: 13px; }
h1 { margin: 0 0 12px; font-size: 30px; line-height: 1.25; }
h2 { margin: 40px 0 10px; font-size: 21px; }
h3, h4, h5, h6 { margin: 28px 0 8px; font-size: 17px; }
p.abstract { color: var(--muted); font-size: 17px; }
a { color: var(--accent); }
code { padding: 1px 5px; border-radius: 5px; background: var(--code); font: 0.9em ui-monospace, SFMono-Regular, Menlo, monospace; }
pre { overflow-x: auto; padding: 14px 16px; border-radius: 10px; background: var(--code); }
pre code { padding: 0; background: none; }
blockquote { margin: 16px 0; padding-left: 14px; border-left: 3px solid var(--line); color: var(--muted); }
table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
td { padding: 6px 10px; border-bottom: 1px solid var(--line); vertical-align: top; }
figure { margin: 20px 0; } img { max-width: 100%; border-radius: 8px; }
ul.cards { list-style: none; padding: 0; display: grid; gap: 10px; }
ul.cards a { display: block; padding: 14px 16px; border: 1px solid var(--line); border-radius: 12px; color: var(--text); text-decoration: none; }
ul.cards span { display: block; color: var(--muted); font-size: 14px; }
footer { margin-top: 56px; color: var(--muted); font-size: 13px; }
"""


def document(title: str, body: str, expires: float, back: str = "") -> str:
    home = f'<a href="{back}">Back to the start</a>' if back else "<span></span>"
    return (
        '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width, initial-scale=1">'
        '<meta name="robots" content="noindex, nofollow">'
        f"<title>{html.escape(title)}</title><style>{STYLE}</style></head>"
        f'<body><main><header class="bar">{home}<span>{html.escape(ending(expires))}</span></header>'
        f"{body}<footer>Shared from an agent journal</footer></main></body></html>"
    )


def unshared() -> str:
    return document("Nothing is shared here", "<h1>Nothing is shared on this link</h1><p class=\"abstract\">It may have been stopped, or "
                    "it has ended. Ask the person who shared it for a new link.</p>", 0)
