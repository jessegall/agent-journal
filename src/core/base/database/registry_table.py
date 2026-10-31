import sqlite3

from core.base.database.database import Database
from core.base.database.statement import Statement

TABLE = Statement("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'registry'")
ROW = Statement("SELECT fingerprint, entries FROM registry WHERE id = 1")
UPSERT = Statement("INSERT INTO registry (id, fingerprint, entries, synced_at) VALUES (1, ?, ?, ?)"
                   " ON CONFLICT (id) DO UPDATE SET fingerprint = excluded.fingerprint, entries = excluded.entries, synced_at = excluded.synced_at")


class RegistryTable:
    """The one row that holds the registry sync wrote: its fingerprint and its entries."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def row(self) -> sqlite3.Row | None:
        rows = self.database.rows(ROW) if self.database.rows(TABLE) else []
        return rows[0] if rows else None

    def write(self, fingerprint: str, entries: str, moment: str) -> bool:
        row = self.row()
        if row is not None and (row["fingerprint"], row["entries"]) == (fingerprint, entries):
            return False
        self.database.update(Statement(UPSERT.sql, (fingerprint, entries, moment)))
        return True
