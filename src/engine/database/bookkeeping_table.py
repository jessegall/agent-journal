import sqlite3
from collections.abc import Callable, Sequence
from typing import TypeVar

from engine.database.row_history import RowHistory
from engine.database.database import READ_LIMIT_ROWS, Database
from engine.database.statement import Statement
from engine.errors.missing_rows_error import MissingRowsError
from engine.row.page import Page

T = TypeVar("T")


class BookkeepingTable:
    """Reads and writes one of the core's own tables, which hold records and no models: a row by id, the rows
    past an id, a page newest first, the rows of several rows a page at a time, the count, and a new row."""

    def __init__(self, database: Database, table: str, cli_name: str) -> None:
        self.database, self.table, self.cli_name = database, table, cli_name

    def row(self, row_id: int) -> sqlite3.Row:
        rows = self.database.rows(Statement(f"SELECT * FROM {self.table} WHERE id = ?", [row_id]))
        if not rows:
            raise MissingRowsError(self.cli_name, [row_id])
        return rows[0]

    def newest_page(self, number: int, size: int, parsed: Callable[[sqlite3.Row], T]) -> Page[T]:
        rows = self.database.rows(Statement(f"SELECT * FROM {self.table} ORDER BY id DESC LIMIT ? OFFSET ?", (size, (number - 1) * size)))
        return Page(tuple(parsed(row) for row in rows), number, size, self.count() if number > 1 else self.id_span())

    def rows_past(self, row_id: int, limit: int) -> list[sqlite3.Row]:
        return self.database.rows(Statement(f"SELECT * FROM {self.table} WHERE id > ? ORDER BY id LIMIT ?", (row_id, limit)))

    def latest_event(self, event: str) -> sqlite3.Row | None:
        rows = self.database.rows(Statement(f"SELECT * FROM {self.table} WHERE name = ? ORDER BY id DESC LIMIT 1", [event]))
        return rows[0] if rows else None

    def newest_row_rows(self, history: RowHistory) -> list[sqlite3.Row]:
        name_filter = f" AND name IN ({', '.join('?' for _ in history.names)})" if history.names else ""
        rows = self.database.rows(Statement(f"SELECT * FROM {self.table} WHERE row_table = ? AND row_id = ?{name_filter} ORDER BY id DESC LIMIT ?",
                                            (history.row_table, history.row_id, *history.names, history.limit)))
        return rows[::-1]

    def row_rows_past(self, history: RowHistory, event_id: int) -> list[sqlite3.Row]:
        return self.database.rows(Statement(f"SELECT * FROM {self.table} WHERE row_table = ? AND row_id = ? AND id > ? ORDER BY id LIMIT ?",
                                            (history.row_table, history.row_id, event_id, history.limit)))

    def latest_row(self, row_table: str, row_id: int, names: Sequence[str]) -> sqlite3.Row | None:
        marks = ", ".join("?" for _ in names)
        rows = self.database.rows(Statement(f"SELECT * FROM {self.table} WHERE row_table = ? AND row_id = ? AND name IN ({marks}) ORDER BY id DESC LIMIT 1",
                                            (row_table, row_id, *names)))
        return rows[0] if rows else None

    def row_rows_many(self, row_table: str, row_ids: Sequence[int]) -> list[sqlite3.Row]:
        if not row_ids:
            return []
        marks = ", ".join("?" for _ in row_ids)
        rows: list[sqlite3.Row] = []
        while True:
            last_id = rows[-1]["id"] if rows else 0
            page = self.database.rows(Statement(f"SELECT * FROM {self.table} WHERE row_table = ? AND row_id IN ({marks}) AND id > ? ORDER BY id LIMIT ?",
                                                [row_table, *row_ids, last_id, READ_LIMIT_ROWS]))
            rows.extend(page)
            if len(page) < READ_LIMIT_ROWS:
                return rows

    def child_rows(self, event_id: int) -> list[sqlite3.Row]:
        return self.database.rows(Statement(f"SELECT * FROM {self.table} WHERE id > ? AND cause_id = ? ORDER BY id", (event_id, event_id)))

    def newest_id(self) -> int:
        return self.database.rows(Statement(f"SELECT coalesce(max(id), 0) FROM {self.table}"))[0][0]

    def insert(self, values: dict[str, object]) -> int:
        marks = ", ".join("?" for _ in values)
        return self.database.insert(Statement(f"INSERT INTO {self.table} ({', '.join(values)}) VALUES ({marks})", tuple(values.values())))

    def count(self) -> int:
        return self.database.rows(Statement(f"SELECT count(*) FROM {self.table}"))[0][0]

    def id_span(self) -> int:
        return self.database.rows(Statement(f"SELECT coalesce(max(id) - min(id) + 1, 0) FROM {self.table}"))[0][0]

    def delete_passed(self, row_tables: Sequence[str], cutoff_at: str, limit: int) -> int:
        marks = ", ".join("?" for _ in row_tables)
        return self.database.update(Statement(f"DELETE FROM {self.table} WHERE id IN (SELECT id FROM {self.table} NOT INDEXED WHERE row_table IN ({marks}) AND created_at < ?"
                                              f" AND id <= (SELECT coalesce(min(event_id), 0) FROM listener_cursors) ORDER BY id LIMIT ?)", (*row_tables, cutoff_at, limit)))
