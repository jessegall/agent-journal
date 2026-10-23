import json
from dataclasses import fields
from sqlite3 import Row

from sync_server.db.store import Store
from sync_server.logged_change import LoggedChange


class ChangeRows:
    """The SQL of the changes table, the team's log in order."""

    def __init__(self, store: Store) -> None:
        self.store = store

    def insert(self, change: LoggedChange) -> int:
        columns = {field.name: self.stored(getattr(change, field.name)) for field in fields(change) if field.name != "sequence"}
        return self.store.execute(f"INSERT INTO changes ({', '.join(columns)}) VALUES ({', '.join('?' for _ in columns)})", tuple(columns.values())).lastrowid

    @staticmethod
    def stored(value: object) -> object:
        return json.dumps(value) if isinstance(value, dict) else value

    def newer(self, sequence: int, device_id: int, limit: int) -> list[Row]:
        return self.store.all("SELECT * FROM changes WHERE sequence > ? AND device_id != ? ORDER BY sequence LIMIT ?", (sequence, device_id, limit))

    def delete_older(self, sequence: int) -> None:
        self.store.execute("DELETE FROM changes WHERE sequence <= ? AND sequence < (SELECT MAX(sequence) FROM changes)", (sequence,))

    def count(self) -> int:
        return self.store.one("SELECT COUNT(*) AS count FROM changes")["count"]

    def head(self) -> int:
        return self.store.one("SELECT COALESCE(MAX(sequence), 0) AS head FROM changes")["head"]
