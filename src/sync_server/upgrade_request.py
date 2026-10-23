from dataclasses import dataclass

from sync_server.copied_row import CopiedRow


@dataclass(frozen=True)
class UpgradeRequest:
    """A journal's migrated full copy, which replaces the team's rows: every row, the highest number each table had, the migration its rows are at, and the sequence it pulled to before it migrated."""

    rows: tuple[CopiedRow, ...]
    highest: dict
    migration: int
    base_sequence: int

    @classmethod
    def parsed(cls, rows: list, highest: dict, migration: int, base_sequence: int) -> "UpgradeRequest":
        return cls(tuple(CopiedRow(**row) for row in rows), dict(highest), int(migration), int(base_sequence))
