import sqlite3


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
