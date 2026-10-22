import json
from sqlite3 import Row

from sync_server.db.store import Store
from sync_server.stored_row import StoredRow


class RowValues:
    """The SQL of the rows table: the current value of every row the team's changes made."""

    def __init__(self, store: Store) -> None:
        self.store = store

    def stored(self, table: str, row: int) -> Row | None:
        return self.store.one("SELECT fields, changed_at, writers, is_deleted FROM rows WHERE row_table = ? AND row = ?", (table, row))

    def write(self, table: str, row: int, stored: StoredRow, is_deleted: bool, sequence: int) -> None:
        self.store.execute("INSERT INTO rows (row_table, row, fields, changed_at, writers, is_deleted, sequence) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT (row_table, row) DO UPDATE SET fields = excluded.fields, changed_at = excluded.changed_at, writers = excluded.writers, is_deleted = excluded.is_deleted, sequence = excluded.sequence", (table, row, json.dumps(stored.fields), json.dumps(stored.changed_at), json.dumps(stored.writers), int(is_deleted), sequence))

    def existing(self) -> list[Row]:
        return self.store.all("SELECT row_table, row, fields, changed_at FROM rows WHERE is_deleted = 0 ORDER BY row_table, row")
