from dataclasses import dataclass

from sync_server.copied_row import CopiedRow


@dataclass(frozen=True)
class UploadRequest:
    """A journal's first full copy: every row, and the highest number each table had."""

    rows: tuple[CopiedRow, ...]
    highest: dict

    @classmethod
    def parsed(cls, rows: list, highest: dict) -> "UploadRequest":
        return cls(tuple(CopiedRow(**row) for row in rows), dict(highest))
