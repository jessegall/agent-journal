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
        return sorted((Version3Row.from_text(path.read_text()) for path in (self.folder / "project" / "doc").glob("*/doc.md")), key=lambda row: row.n)

    def of(self, environment: str, kind: str) -> list[Version3Row]:
        return self.read(self.folder / "environments" / environment / kind)

    def read(self, where: Path) -> list[Version3Row]:
        if not where.is_dir():
            return []
        rows = {row.n: row for row in self.packed(where)}
        rows.update({row.n: row for row in (Version3Row.from_text(path.read_text()) for path in where.glob("*.md"))})
        return [rows[n] for n in sorted(rows)]

    @staticmethod
    def packed(where: Path) -> list[Version3Row]:
        rows = []
        for path in sorted((where / "packed").glob("*.zip")):
            with zipfile.ZipFile(path) as packed:
                rows += [Version3Row.from_text(packed.read(name).decode()) for name in packed.namelist() if name.endswith(".md")]
        return rows

    def is_in_use(self, environment: Version3Row) -> bool:
        if environment.title == "main" or environment.data.get("kind") == "main":
            return True
        if (self.folder.parents[1] / ".claude" / "worktrees" / environment.title).is_dir():
            return True
        return any(row.is_open() for kind in ("todo", "question") for row in self.of(environment.title, kind))
