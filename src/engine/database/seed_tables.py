from collections.abc import Sequence

from engine.database.database import Database

ID_COLUMN = "id"


class SeedTables:
    """The statements a seeder of the test kit runs: the columns and the lowest id of a table, its rows numbered
    zero and below, many rows written at once, and the rules of the tables on states and types, which it can
    drop and put back. None of it goes through the read limit, since it reads the shape of the database and
    not a journal's rows for an agent."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def column_names(self, table: str) -> set[str]:
        return {row[1] for row in self.database.connection.execute(f"PRAGMA table_info({table})").fetchall()}

    def lowest_id(self, table: str) -> int:
        return self.database.connection.execute(f"SELECT coalesce(min({ID_COLUMN}), 1) FROM {table}").fetchone()[0]

    def seeded_ids(self, table: str, most: int) -> tuple[int, ...]:
        rows = self.database.connection.execute(f"SELECT {ID_COLUMN} FROM {table} WHERE {ID_COLUMN} <= 0 ORDER BY {ID_COLUMN} DESC LIMIT ?", [most]).fetchall()
        return tuple(row[0] for row in rows)

    def insert_rows(self, table: str, columns: Sequence[str], rows: Sequence[Sequence[object]]) -> None:
        self.database.connection.executemany(f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({', '.join('?' for _ in columns)})", rows)

    def rules(self) -> list[tuple[str, str]]:
        return [(row[0], row[1]) for row in self.database.connection.execute("SELECT name, sql FROM sqlite_master WHERE type = 'trigger'").fetchall()]

    def drop_rule(self, name: str) -> None:
        self.database.connection.execute(f"DROP TRIGGER {name}")

    def restore_rule(self, statement: str) -> None:
        self.database.connection.execute(statement)
