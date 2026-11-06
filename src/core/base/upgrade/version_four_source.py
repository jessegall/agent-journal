import sqlite3
from pathlib import Path
from types import TracebackType

from core.base.database.version_four_tables import VersionFourTables
from core.base.upgrade.source_row import SourceRow


class VersionFourSource:
    """A version 4 database opened read-only: its rows, its table names and the folder it is in, and never a
    write."""

    def __init__(self, path: Path) -> None:
        self.folder = path.resolve().parent
        self.connection = sqlite3.connect(f"{path.resolve().as_uri()}?mode=ro", uri=True)
        self.connection.row_factory = SourceRow
        self.version_four = VersionFourTables(self.connection)

    def __enter__(self) -> "VersionFourSource":
        return self

    def __exit__(self, error_type: type[BaseException] | None, error: BaseException | None, trace: TracebackType | None) -> None:
        self.connection.close()

    def tables(self) -> tuple[str, ...]:
        return self.version_four.names()

    def rows(self, table: str) -> list[sqlite3.Row]:
        return self.version_four.rows(table)

    def count(self, table: str) -> int:
        return self.version_four.count(table)

    def creator_spans(self, creator_type: str) -> list[sqlite3.Row]:
        return self.version_four.creator_spans(creator_type)

    def links(self, *link_types: str) -> list[sqlite3.Row]:
        return self.version_four.links(link_types)
