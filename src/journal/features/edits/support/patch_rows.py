import difflib
import re
from dataclasses import dataclass

from journal.features.edits.support.patch_row import PatchRow

HUNK = re.compile(r"^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@")
"""The head of a hunk of a unified diff: where it starts in the old file and in the new."""
AROUND = 2
"""How many unchanged lines a change made by a shell command is drawn with, above and below."""


@dataclass(frozen=True)
class PatchRows:
    """The changed lines of a tool's edit, numbered, from the provider's structured patch; a whole write, or an edit with no patch, is its new lines, all added."""

    rows: tuple[PatchRow, ...]

    @classmethod
    def of(cls, response: dict, input_: dict, tool: str) -> "PatchRows":
        hunks = response.get("structuredPatch", [])
        if not hunks:
            added = (input_.get("new_string", "") if tool == "Edit" else input_.get("content", "")).splitlines()
            return cls(tuple(PatchRow("add", n, line) for n, line in enumerate(added, 1)))
        return cls(tuple(row for hunk in hunks for row in cls.hunk(hunk.get("oldStart", 1), hunk.get("newStart", 1), hunk.get("lines", []))))

    @classmethod
    def between(cls, before: str, after: str) -> "PatchRows":
        """The changed lines from one version of a file to the next, as a shell command's change is told; the diff's two lines naming the files are left out."""
        rows, hunk, old, new = [], [], 1, 1
        for line in list(difflib.unified_diff(before.splitlines(), after.splitlines(), lineterm="", n=AROUND))[2:]:
            head = HUNK.match(line)
            if head:
                rows += cls.hunk(old, new, hunk)
                hunk, old, new = [], int(head[1]), int(head[2])
                continue
            hunk.append(line)
        return cls(tuple(rows + cls.hunk(old, new, hunk)))

    @staticmethod
    def hunk(old: int, new: int, lines: list[str]) -> list[PatchRow]:
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
