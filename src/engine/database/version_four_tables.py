import sqlite3
from collections.abc import Sequence

LINKS = "links"
CREATOR_COLUMNS = {"creator", "environment_id", "created_at"}


class VersionFourTables:
    """The tables and rows of a version 4 database through a read-only connection."""

    def __init__(self, connection: sqlite3.Connection) -> None:
        self.connection = connection

    def names(self) -> tuple[str, ...]:
        listed = self.connection.execute("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name").fetchall()
        return tuple(row["name"] for row in listed)

    def rows(self, table: str) -> list[sqlite3.Row]:
        if table not in self.names():
            return []
        return self.connection.execute(f'SELECT * FROM "{table}" ORDER BY rowid').fetchall()

    def count(self, table: str) -> int:
        if table not in self.names():
            return 0
        return int(self.connection.execute(f'SELECT count(*) FROM "{table}"').fetchone()[0])

    def creator_spans(self, creator_type: str) -> list[sqlite3.Row]:
        tables = [name for name in self.names() if CREATOR_COLUMNS <= self.columns(name)]
        if not tables:
            return []
        spans = " UNION ALL ".join(f'SELECT creator, environment_id, created_at FROM "{table}" WHERE creator LIKE ? AND environment_id > 0' for table in tables)
        spans_with_end = f"SELECT creator, environment_id, created_at, max(created_at) OVER (PARTITION BY creator) AS last_at FROM ({spans})"
        return self.connection.execute(f"SELECT creator, environment_id, min(created_at) AS first_at, last_at FROM ({spans_with_end}) GROUP BY creator ORDER BY first_at",
                                       tuple(f"{creator_type}:%" for _ in tables)).fetchall()

    def columns(self, table: str) -> set[str]:
        return {row["name"] for row in self.connection.execute(f'PRAGMA table_info("{table}")').fetchall()}

    def links(self, link_types: Sequence[str]) -> list[sqlite3.Row]:
        if LINKS not in self.names() or not link_types:
            return []
        marks = ", ".join("?" for _ in link_types)
        return self.connection.execute(f"SELECT * FROM {LINKS} WHERE link_type IN ({marks}) ORDER BY rowid", tuple(link_types)).fetchall()
