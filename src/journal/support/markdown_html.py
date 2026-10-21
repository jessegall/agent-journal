import html
import re

CODE_SPAN = re.compile(r"`([^`]+)`")
BOLD = re.compile(r"\*\*(.+?)\*\*")
ITALIC = re.compile(r"(?<![\w*])[*_](?!\s)(.+?)(?<!\s)[*_](?![\w*])")
LINK = re.compile(r"\[([^\]]+)\]\((https?://[^)\s]+)\)")
LIST_ITEM = re.compile(r"^\s*(?:[-*]|(\d+)\.)\s+(.*)$")
HEADING = re.compile(r"^(#{1,4})\s+(.*)$")
FENCE = "```"


class MarkdownHtml:
    """A markdown text as HTML: paragraphs, headings, lists, quotes, fenced code, tables, and the spans inside a line."""

    @classmethod
    def build(cls, text: str) -> str:
        lines = text.replace("\r", "").split("\n")
        blocks, index = [], 0
        while index < len(lines):
            block, index = cls.block(lines, index)
            if block:
                blocks.append(block)
        return "\n".join(blocks)

    @classmethod
    def block(cls, lines: list[str], index: int) -> tuple[str, int]:
        line = lines[index]
        if line.startswith(FENCE):
            stop = next((i for i in range(index + 1, len(lines)) if lines[i].startswith(FENCE)), len(lines))
            return f"<pre><code>{html.escape(chr(10).join(lines[index + 1:stop]))}</code></pre>", stop + 1
        if not line.strip():
            return "", index + 1
        heading = HEADING.match(line)
        if heading:
            level = min(6, len(heading.group(1)) + 2)
            return f"<h{level}>{cls.inline(heading.group(2))}</h{level}>", index + 1
        if LIST_ITEM.match(line):
            return cls.list_block(lines, index)
        if line.startswith(">"):
            stop = cls.block_end(lines, index, lambda l: l.startswith(">"))
            return f"<blockquote>{cls.inline(' '.join(l.lstrip('> ') for l in lines[index:stop]))}</blockquote>", stop
        if line.lstrip().startswith("|"):
            stop = cls.block_end(lines, index, lambda l: l.lstrip().startswith("|"))
            return cls.table(lines[index:stop]), stop
        stop = cls.block_end(lines, index, lambda l: l.strip() and not (l.startswith((FENCE, ">")) or HEADING.match(l) or LIST_ITEM.match(l)))
        return f"<p>{cls.inline(' '.join(l.strip() for l in lines[index:stop]))}</p>", stop

    @staticmethod
    def block_end(lines: list[str], index: int, continues) -> int:
        stop = index
        while stop < len(lines) and continues(lines[stop]):
            stop += 1
        return stop

    @classmethod
    def list_block(cls, lines: list[str], index: int) -> tuple[str, int]:
        stop = cls.block_end(lines, index, LIST_ITEM.match)
        tag = "ol" if LIST_ITEM.match(lines[index]).group(1) else "ul"
        items = "".join(f"<li>{cls.inline(LIST_ITEM.match(l).group(2))}</li>" for l in lines[index:stop])
        return f"<{tag}>{items}</{tag}>", stop

    @classmethod
    def table(cls, block: list[str]) -> str:
        rows = [[cell.strip() for cell in line.strip().strip("|").split("|")] for line in block]
        body_rows = [cells for cells in rows if not all(set(cell) <= set("-: ") for cell in cells)]
        return "<table>" + "".join("<tr>" + "".join(f"<td>{cls.inline(cell)}</td>" for cell in cells) + "</tr>" for cells in body_rows) + "</table>"

    @staticmethod
    def inline(text: str) -> str:
        spans = []

        def code_span(match) -> str:
            spans.append(f"<code>{html.escape(match.group(1))}</code>")
            return f"\x00{len(spans) - 1}\x00"

        text = html.escape(CODE_SPAN.sub(code_span, text), quote=False)
        text = LINK.sub(lambda match: f'<a href="{html.escape(match.group(2), quote=True)}">{match.group(1)}</a>', text)
        text = ITALIC.sub(r"<em>\1</em>", BOLD.sub(r"<strong>\1</strong>", text))
        return re.sub("\x00(\\d+)\x00", lambda match: spans[int(match.group(1))], text)
