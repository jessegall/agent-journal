from dataclasses import dataclass

from sync_server.copied_row import CopiedRow


@dataclass(frozen=True)
class UploadRequest:
    """A journal's first full copy: every row, the highest number each table had, the first commit of the repository it belongs to, the version of the journal that made it, which the team is then pinned to, and the migration its rows are at."""

    rows: tuple[CopiedRow, ...]
    highest: dict
    repository: str
    version: str
    migration: int

    @classmethod
    def parsed(cls, rows: list, highest: dict, repository: str, version: str, migration: int) -> "UploadRequest":
        return cls(tuple(CopiedRow(**row) for row in rows), dict(highest), repository, version, int(migration))
