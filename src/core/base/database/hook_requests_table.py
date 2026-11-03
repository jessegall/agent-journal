from core.base.database.database import Database
from core.base.database.statement import Statement


class HookRequestsTable:
    """Stores completed requests without creating command events."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def record(self, payload: str, size: int) -> None:
        with self.database.transaction():
            self.database.insert(Statement("INSERT INTO hook_requests (payload) VALUES (?)", [payload]))
            self.database.update(Statement(
                "DELETE FROM hook_requests WHERE id NOT IN (SELECT id FROM hook_requests ORDER BY id DESC LIMIT ?)",
                [size],
            ))
