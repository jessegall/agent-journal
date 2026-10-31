import sqlite3
from collections.abc import Callable
from typing import TypeVar

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.missing_rows import MissingRows
from core.base.page import Page

T = TypeVar("T")


class BookkeepingTable:
    """Reads and writes one of the core's own tables, which hold records and no models: a row by id, the rows
    past an id, a page newest first, the count, and a new row."""

    def __init__(self, database: Database, table: str, cli_name: str) -> None:
        self.database, self.table, self.cli_name = database, table, cli_name

    def row(self, row_id: int) -> sqlite3.Row:
        rows = self.database.rows(Statement(f"SELECT * FROM {self.table} WHERE id = ?", [row_id]))
        if not rows:
            raise MissingRows(self.cli_name, [row_id])
        return rows[0]

    def newest_page(self, number: int, size: int, parsed: Callable[[sqlite3.Row], T]) -> Page[T]:
        rows = self.database.rows(Statement(f"SELECT * FROM {self.table} ORDER BY id DESC LIMIT ? OFFSET ?", (size, (number - 1) * size)))
        return Page(tuple(parsed(row) for row in rows), number, size, self.count())

    def rows_past(self, row_id: int, limit: int) -> list[sqlite3.Row]:
        return self.database.rows(Statement(f"SELECT * FROM {self.table} WHERE id > ? ORDER BY id LIMIT ?", (row_id, limit)))

    def newest_id(self) -> int:
        return self.database.rows(Statement(f"SELECT coalesce(max(id), 0) FROM {self.table}"))[0][0]

    def insert(self, values: dict[str, object]) -> int:
        marks = ", ".join("?" for _ in values)
        return self.database.insert(Statement(f"INSERT INTO {self.table} ({', '.join(values)}) VALUES ({marks})", tuple(values.values())))

    def count(self) -> int:
        return self.database.rows(Statement(f"SELECT count(*) FROM {self.table}"))[0][0]
