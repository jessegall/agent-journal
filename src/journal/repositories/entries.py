from journal.models.entry import Entry
from journal.repositories.scoped_repository import ScopedRepository


class Entries(ScopedRepository[Entry]):
    model = Entry

    def since(self, environment_id: int, id: int) -> list[Entry]:
        rows = self.connection.all(f"SELECT * FROM {self.table} WHERE environment_id = ? AND id > ? ORDER BY id", (environment_id, id))
        return [self._load(row) for row in rows]
