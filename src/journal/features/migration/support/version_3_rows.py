import zipfile
from pathlib import Path

from journal.features.migration.support.version_3_row import Version3Row

class Version3Rows:
    """The rows of a version 3 journal kept in .journal/version-3: each kind's loose files and the closed ones packed into daily zips."""

    def __init__(self, folder: Path) -> None:
        self.folder = folder

    def environments(self) -> list[Version3Row]:
        return self.read(self.folder / "project" / "environment")

    def project(self, kind: str) -> list[Version3Row]:
        return self.read(self.folder / "project" / kind)

    def docs(self) -> list[Version3Row]:
        return sorted((Version3Row.parsed(path.read_text()) for path in (self.folder / "project" / "doc").glob("*/doc.md")), key=lambda row: row.n)

    def rows(self, environment: str, kind: str) -> list[Version3Row]:
        return self.read(self.folder / "environments" / environment / kind)

    def read(self, caller: Path) -> list[Version3Row]:
        if not caller.is_dir():
            return []
        rows = {row.n: row for row in self.packed(caller)}
        rows.update({row.n: row for row in (Version3Row.parsed(path.read_text()) for path in caller.glob("*.md"))})
        return [rows[n] for n in sorted(rows)]

    @staticmethod
    def packed(caller: Path) -> list[Version3Row]:
        rows = []
        for path in sorted((caller / "packed").glob("*.zip")):
            with zipfile.ZipFile(path) as packed:
                rows += [Version3Row.parsed(packed.read(name).decode()) for name in packed.namelist() if name.endswith(".md")]
        return rows

    def is_used(self, environment: Version3Row) -> bool:
        if environment.title == "main" or environment.data.get("kind") == "main":
            return True
        if (self.folder.parents[1] / ".claude" / "worktrees" / environment.title).is_dir():
            return True
        return any(row.is_open() for kind in ("todo", "question") for row in self.rows(environment.title, kind))
