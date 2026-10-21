import json
from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration

TABLES = {"pairing_codes": "phone_codes"}
COLUMNS = {"phone_codes": {"expiry_time": "expires_at"}}
STATE_FIELDS = {"awaiting": {"start_time": "started_at", "reminder_time": "reminded_at"}}


class TimestampRenames(Migration):
    """The phone codes take their table's new name, and every point in time still named with _time takes its _at name, in the columns and in the waits stored on an agent's row."""

    number: ClassVar[int] = 26

    def apply(self, connection: Connection) -> None:
        for old, new in TABLES.items():
            self.table_rename(connection, old, new)
        for table, columns in COLUMNS.items():
            for old, new in columns.items():
                self.column_rename(connection, table, old, new)
        for row in connection.all("SELECT id, state, data, stack FROM agents"):
            stack = [{**layer, "data": renamed(layer["state"], layer.get("data") or {})} for layer in json.loads(row["stack"] or "[]")]
            connection.execute("UPDATE agents SET stack = ?, data = ? WHERE id = ?", (json.dumps(stack), json.dumps(renamed(row["state"], json.loads(row["data"] or "{}"))), row["id"]))

    @staticmethod
    def table_rename(connection: Connection, old: str, new: str) -> None:
        tables = {row["name"] for row in connection.all("SELECT name FROM sqlite_master WHERE type = 'table'")}
        if old not in tables:
            return
        if new in tables:
            connection.execute(f"DROP TABLE {new}")
        connection.execute(f"ALTER TABLE {old} RENAME TO {new}")

    @staticmethod
    def column_rename(connection: Connection, table: str, old: str, new: str) -> None:
        present = {row["name"] for row in connection.all(f"PRAGMA table_info({table})")}
        if old not in present:
            return
        if new in present:
            connection.execute(f"ALTER TABLE {table} DROP COLUMN {new}")
        connection.execute(f"ALTER TABLE {table} RENAME COLUMN {old} TO {new}")

def renamed(state: str, data: dict) -> dict:
    fields = STATE_FIELDS.get(state, {})
    return {fields.get(key, key): value for key, value in data.items()}
