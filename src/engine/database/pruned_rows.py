from engine.database.database import Database
from engine.database.statement import Statement


class PrunedRows:
    """Deletes rows a model named prunable with one plain statement, without an event per row, so a prune of many
    rows never fills the event log or holds the write lock for long."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def delete(self, table: str, ids: list[int]) -> int:
        marks = ", ".join("?" for _ in ids)
        return self.database.update(Statement(f'DELETE FROM "{table}" WHERE id IN ({marks})', ids)) if ids else 0
