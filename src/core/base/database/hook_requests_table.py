from core.base.database.database import Database
from core.base.database.statement import Statement


class HookRequestsTable:
    """Stores completed requests without creating command events."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def filter_options(self) -> list[tuple[str, str]]:
        return [(str(row[0]), str(row[1])) for row in self.database.rows(Statement("SELECT DISTINCT family, sender FROM hook_request_rows"))]

    def record(self, payload: str, size: int) -> None:
        with self.database.transaction():
            self.database.insert(Statement("INSERT INTO hook_requests (payload) VALUES (?)", [payload]))
            self.database.update(Statement(
                "DELETE FROM hook_requests WHERE id NOT IN (SELECT id FROM hook_requests ORDER BY id DESC LIMIT ?)",
                [size],
            ))
