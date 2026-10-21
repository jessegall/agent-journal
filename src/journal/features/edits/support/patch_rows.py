import difflib
import re
from dataclasses import dataclass

from journal.features.edits.support.patch_row import PatchRow

DIFF_HEAD = re.compile(r"^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@")
CONTEXT_LINES = 2


@dataclass(frozen=True)
class PatchRows:
    """The changed lines of a tool's edit, numbered: from the provider's structured patch, or from one version of a file to the next as a shell command's change is told, each section of the diff read from its head line, the old and new start, with two unchanged lines kept on each side of a change."""

    rows: tuple[PatchRow, ...]

    @classmethod
    def of(cls, response: dict) -> "PatchRows":
        return cls(tuple(row for section in response.get("structuredPatch", []) for row in cls.section(section.get("oldStart", 1), section.get("newStart", 1), section.get("lines", []))))

    @classmethod
    def from_versions(cls, old_text: str, new_text: str) -> "PatchRows":
        rows, section, old, new = [], [], 1, 1
        for line in list(difflib.unified_diff(old_text.splitlines(), new_text.splitlines(), lineterm="", n=CONTEXT_LINES))[2:]:
            head = DIFF_HEAD.match(line)
            if head:
                rows += cls.section(old, new, section)
                section, old, new = [], int(head[1]), int(head[2])
                continue
            section.append(line)
        return cls(tuple(rows + cls.section(old, new, section)))

    @staticmethod
    def section(old: int, new: int, lines: list[str]) -> list[PatchRow]:
        rows = []
        for text in lines:
            mark, body = text[:1], text[1:]
            if mark == "+":
                rows.append(PatchRow("add", new, body))
                new += 1
            elif mark == "-":
                rows.append(PatchRow("del", old, body))
                old += 1
            else:
                rows.append(PatchRow("ctx", new, body))
                new += 1
                old += 1
        return rows

    def counted(self, kind: str) -> int:
        return len([r for r in self.rows if r.kind == kind])

    @property
    def first_line(self) -> int:
        return min((r.line for r in self.rows if r.line), default=1)

    @property
    def last_line(self) -> int:
        return max((r.line for r in self.rows if r.line), default=len(self.rows))
