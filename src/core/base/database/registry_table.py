import sqlite3

from core.base.database.database import Database
from core.base.database.kept_rows import KeptRows
from core.base.database.registry_version import RegistryVersion
from core.base.database.statement import Statement

ROW = Statement("SELECT fingerprint, entries FROM registry WHERE id = 1")
VERSION = Statement("SELECT fingerprint, synced_at FROM registry WHERE id = 1")
UPSERT = Statement("INSERT INTO registry (id, fingerprint, entries, synced_at) VALUES (1, ?, ?, ?)"
                   " ON CONFLICT (id) DO UPDATE SET fingerprint = excluded.fingerprint, entries = excluded.entries, synced_at = excluded.synced_at")


class RegistryTable:
    """The one row that holds the registry sync wrote: its fingerprint and its entries."""

    def __init__(self, database: Database) -> None:
        self.database = database
        self.kept = KeptRows(database)

    def row(self) -> sqlite3.Row | None:
        return self.kept.scoped_current(self.stored_row, name="base.registry")

    def stored_row(self) -> sqlite3.Row | None:
        rows = self.database.rows(ROW)
        return rows[0] if rows else None

    def version(self) -> RegistryVersion | None:
        rows = self.database.rows(VERSION)
        if not rows:
            return None
        row = rows[0]
        return RegistryVersion(self.database.identity, row["fingerprint"], row["synced_at"], self.database)

    def write(self, fingerprint: str, entries: str, timestamp: str) -> bool:
        row = self.row()
        if row is not None and (row["fingerprint"], row["entries"]) == (fingerprint, entries):
            return False
        self.database.update(Statement(UPSERT.sql, (fingerprint, entries, timestamp)))
        return True
