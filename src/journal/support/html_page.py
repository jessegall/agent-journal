import html

from journal.support.markdown_html import MarkdownHtml
from journal.support.outline import Outline

STYLE = """
body { margin: 0; color: #1c1d21; font: 16px/1.65 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
main { max-width: 760px; margin: 0 auto; padding: 48px 20px 80px; }
h1 { margin: 0 0 12px; font-size: 30px; line-height: 1.25; }
h2 { margin: 40px 0 10px; font-size: 21px; }
h3, h4, h5, h6 { margin: 28px 0 8px; font-size: 17px; }
p.abstract { color: #6b6f78; font-size: 17px; }
code { padding: 1px 5px; border-radius: 5px; background: #f4f4f6; font: 0.9em ui-monospace, Menlo, monospace; }
pre { overflow-x: auto; padding: 14px 16px; border-radius: 10px; background: #f4f4f6; }
blockquote { margin: 16px 0; padding-left: 14px; border-left: 3px solid #e6e7ea; color: #6b6f78; }
table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
td { padding: 6px 10px; border-bottom: 1px solid #e6e7ea; vertical-align: top; }
footer { margin-top: 56px; color: #6b6f78; font-size: 13px; }
"""
FOOTER = "Written in the agent journal"


class HtmlPage:
    """A document or a report as one self-contained HTML page: its title, its abstract, its sections under their headings, and a footer."""

    @classmethod
    def of(cls, title: str, abstract: str, body: str) -> str:
        parts = [f"<h1>{html.escape(title)}</h1>"]
        if abstract:
            parts.append(f'<p class="abstract">{MarkdownHtml.inline(abstract)}</p>')
        for section in Outline.of(body).sections:
            if section.number:
                parts.append(f"<h2>{MarkdownHtml.inline(section.heading)}</h2>")
            parts.append(MarkdownHtml.of("\n".join(section.lines)))
        return cls.framed(title, "\n".join(parts))

    @staticmethod
    def framed(title: str, body: str) -> str:
        return ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
                f"<title>{html.escape(title)}</title><style>{STYLE}</style></head><body><main>{body}<footer>{FOOTER}</footer></main></body></html>")
