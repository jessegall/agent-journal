from journal.models.entry import Entry
from journal.repositories.scoped_repository import ScopedRepository


class Entries(ScopedRepository[Entry]):
    model = Entry

    def of_kind(self, environment_id: int, kind: str, last: int = 50) -> list[Entry]:
        rows = self.connection.all(f"SELECT * FROM {self.table} WHERE environment_id = ? AND kind = ? ORDER BY id DESC LIMIT ?", (environment_id, kind, last))
        return [self._load(row) for row in rows]

    def last_id(self, environment_id: int) -> int:
        row = self.connection.one(f"SELECT MAX(id) AS id FROM {self.table} WHERE environment_id = ?", (environment_id,))
        return row["id"] or 0

    def since(self, environment_id: int, id: int) -> list[Entry]:
        rows = self.connection.all(f"SELECT * FROM {self.table} WHERE environment_id = ? AND id > ? ORDER BY id", (environment_id, id))
        return [self._load(row) for row in rows]
