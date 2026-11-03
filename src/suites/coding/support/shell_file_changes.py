import re
from collections.abc import Mapping, Sequence
from pathlib import Path

from core.base.driver.diff_count import DiffCount
from suites.coding.modules.workers.support.worktree_git import GIT_LIMIT_SECONDS, WorktreeGit
from suites.coding.support.patch_row import PatchRow
from suites.coding.support.shell_file_change import ShellFileChange

NEW_FILE_STATUS = "??"
ROW_LIMIT_ROWS = 600
PATCH_SECTION_LINE = re.compile(r"^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@")


class ShellFileChanges:
    """What a shell command did to a file it names as written, read from git: the lines changed against the last
    commit, all of a new file's lines as added, and nothing for a file the command left as it was. Its rows have
    the shape the hook gives an edit tool's lines, cut at the same limits."""

    def __init__(self, git: WorktreeGit) -> None:
        self.git = git

    def change(self, folder: str, path: str) -> ShellFileChange | None:
        if (Path(folder) / path).is_dir():
            return None
        patch = self.git.git(folder, GIT_LIMIT_SECONDS, "diff", "HEAD", "--", path).stdout
        if patch.strip():
            rows = self.patch_rows(patch)
            return ShellFileChange(DiffCount(path, True, self.counted(rows, "add"), self.counted(rows, "del")), self.limited(rows))
        if not self.git.git(folder, GIT_LIMIT_SECONDS, "status", "--porcelain", "--", path).stdout.startswith(NEW_FILE_STATUS):
            return None
        lines = (Path(folder) / path).read_text(errors="replace").splitlines()
        rows = [PatchRow("add", number, line) for number, line in enumerate(lines, start=1)]
        return ShellFileChange(DiffCount(path, False, len(lines), 0), self.limited(rows))

    @staticmethod
    def patch_rows(patch: str) -> list[PatchRow]:
        rows: list[PatchRow] = []
        old_line, new_line = 0, 0
        lines = patch.splitlines()
        first_section = next((index for index, line in enumerate(lines) if PATCH_SECTION_LINE.match(line)), len(lines))
        for line in lines[first_section:]:
            section = PATCH_SECTION_LINE.match(line)
            if section:
                old_line, new_line = int(section[1]), int(section[2])
            elif line.startswith("+"):
                rows.append(PatchRow("add", new_line, line[1:]))
                new_line += 1
            elif line.startswith("-"):
                rows.append(PatchRow("del", old_line, line[1:]))
                old_line += 1
            elif line.startswith(" "):
                rows.append(PatchRow("ctx", new_line, line[1:]))
                old_line, new_line = old_line + 1, new_line + 1
        return rows

    @staticmethod
    def counted(rows: Sequence[PatchRow], line_type: str) -> int:
        return sum(1 for row in rows if row.line_type == line_type)

    @staticmethod
    def limited(rows: Sequence[PatchRow]) -> tuple[Mapping[str, object], ...]:
        listed = [row.listed() for row in rows[:ROW_LIMIT_ROWS]]
        if len(rows) > ROW_LIMIT_ROWS:
            listed.append({"line_type": "fold", "line": 0, "text": "", "hidden": len(rows) - ROW_LIMIT_ROWS})
        return tuple(listed)
