from journal.models.entry import Entry
from journal.repositories.scoped_repository import ScopedRepository


class Entries(ScopedRepository[Entry]):
    model = Entry

    def of_kind(self, environment_id: int, kind: str, last: int = 50) -> list[Entry]:
        rows = self.connection.all(f"SELECT * FROM {self.table} WHERE environment_id = ? AND kind = ? ORDER BY id DESC LIMIT ?", (environment_id, kind, last))
        return [self._load(row) for row in rows]

    def of_kind_in(self, environment_id: int, last: int = 400) -> list[Entry]:
        """The newest entries here of every kind, newest first."""
        rows = self.connection.all(f"SELECT * FROM {self.table} WHERE environment_id = ? ORDER BY id DESC LIMIT ?", (environment_id, last))
        return [self._load(row) for row in rows]

    def last_of_session(self, environment_id: int, session: str) -> Entry | None:
        """The latest hook entry this session sent, which says what the agent is doing right now."""
        row = self.connection.one(f"SELECT * FROM {self.table} WHERE environment_id = ? AND actor = ? AND kind != 'nudge' ORDER BY id DESC LIMIT 1", (environment_id, f"agent:{session}"))
        return self._load(row) if row else None

    def last_id(self, environment_id: int) -> int:
        row = self.connection.one(f"SELECT MAX(id) AS id FROM {self.table} WHERE environment_id = ?", (environment_id,))
        return row["id"] or 0

    def since(self, environment_id: int, id: int) -> list[Entry]:
        rows = self.connection.all(f"SELECT * FROM {self.table} WHERE environment_id = ? AND id > ? ORDER BY id", (environment_id, id))
        return [self._load(row) for row in rows]
