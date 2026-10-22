from dataclasses import dataclass

from sync_server.copied_row import CopiedRow


@dataclass(frozen=True)
class UploadRequest:
    """A journal's first full copy: every row, the highest number each table had, and the first commit of the repository it belongs to."""

    rows: tuple[CopiedRow, ...]
    highest: dict
    repository: str

    @classmethod
    def parsed(cls, rows: list, highest: dict, repository: str = "") -> "UploadRequest":
        return cls(tuple(CopiedRow(**row) for row in rows), dict(highest), repository)
