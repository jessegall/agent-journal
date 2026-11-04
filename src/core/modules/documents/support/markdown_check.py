import re

from core.base.refusal import Refusal
from core.modules.documents.support.markdown_fault import MarkdownFault
from core.modules.documents.support.numbered_line import NumberedLine

OPENING_FENCE = re.compile(r"^\s*(`{3,}|~{3,})[^`]*$")
CLOSING_FENCE = re.compile(r"^\s*(`{3,}|~{3,})\s*$")
TABLE_SEPARATOR = re.compile(r"^\s*\|?\s*:?-{3,}")
CELL_BORDER = re.compile(r"(?<!\\)\|")
HEADING_LEVEL = re.compile(r"^(#{1,6})\s")
HEADING_WITHOUT_SPACE = re.compile(r"^#{2,6}[^#\s]")
MOST_FAULTS_SHOWN = 5


class MarkdownCheck:
    """Finds the faults in a text that make the viewer draw it wrongly, and refuses a text that has any."""

    @classmethod
    def check(cls, text: str) -> None:
        faults = cls.faults(text)
        if faults:
            shown = "; ".join(str(fault) for fault in faults[:MOST_FAULTS_SHOWN])
            raise Refusal(f"the Markdown has {len(faults)} faults: {shown}", "fix those lines and save again")

    @classmethod
    def faults(cls, text: str) -> tuple[MarkdownFault, ...]:
        numbered = [NumberedLine(number, line) for number, line in enumerate(text.splitlines(), start=1)]
        prose, unclosed = cls.unfenced_lines(numbered)
        return tuple(sorted((*unclosed, *cls.line_faults(prose), *cls.heading_faults(prose), *cls.table_faults(prose))))

    @staticmethod
    def unfenced_lines(lines: list[NumberedLine]) -> tuple[list[NumberedLine], list[MarkdownFault]]:
        prose: list[NumberedLine] = []
        opening: NumberedLine | None = None
        mark = ""
        for line in lines:
            if opening is None and (fence := OPENING_FENCE.match(line.text)):
                opening, mark = line, fence[1]
            elif opening is None:
                prose.append(line)
            elif line.text.strip().startswith(mark) and CLOSING_FENCE.match(line.text):
                opening = None
        return prose, [MarkdownFault(opening.number, "this code fence is never closed")] if opening else []

    @staticmethod
    def line_faults(prose: list[NumberedLine]) -> list[MarkdownFault]:
        faults = [MarkdownFault(line.number, "a heading needs a space after its # marks") for line in prose if HEADING_WITHOUT_SPACE.match(line.text)]
        return faults + [MarkdownFault(line.number, "a backtick has no partner on this line") for line in prose if line.text.count("`") % 2]

    @staticmethod
    def heading_faults(prose: list[NumberedLine]) -> list[MarkdownFault]:
        headings = [(line, len(heading[1])) for line in prose if (heading := HEADING_LEVEL.match(line.text))]
        return [MarkdownFault(line.number, f"this heading skips from level {last_level} to level {level}")
                for (_, last_level), (line, level) in zip(headings, headings[1:]) if level > last_level + 1]

    @classmethod
    def table_faults(cls, prose: list[NumberedLine]) -> list[MarkdownFault]:
        faults: list[MarkdownFault] = []
        position = 0
        while position < len(prose):
            line = prose[position]
            following = prose[position + 1].text if position + 1 < len(prose) else ""
            if "|" in line.text and TABLE_SEPARATOR.match(following):
                rows = cls.table_rows(prose, position)
                faults += cls.row_faults(rows)
                position += len(rows)
                continue
            if line.text.lstrip().startswith("|"):
                faults.append(MarkdownFault(line.number, "this table has no line of dashes under its header"))
            position += 1
        return faults

    @staticmethod
    def table_rows(prose: list[NumberedLine], start: int) -> list[NumberedLine]:
        rows = prose[start:start + 2]
        for line in prose[start + 2:]:
            if "|" not in line.text:
                break
            rows.append(line)
        return rows

    @classmethod
    def row_faults(cls, rows: list[NumberedLine]) -> list[MarkdownFault]:
        columns = cls.cell_count(rows[0].text)
        return [MarkdownFault(row.number, f"this row has {cls.cell_count(row.text)} cells, its header has {columns}")
                for row in rows[1:] if cls.cell_count(row.text) != columns]

    @staticmethod
    def cell_count(row: str) -> int:
        stripped = row.strip().removeprefix("|").removesuffix("|")
        return len(CELL_BORDER.split(stripped))
