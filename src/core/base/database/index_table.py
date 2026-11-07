from collections.abc import Mapping

from core.base.database.database import Database
from core.base.database.statement import Statement


class IndexTable:
    """Reads and restores explicit SQLite index definitions."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def statements(self, table: str) -> dict[str, Statement]:
        return {row["name"]: Statement(row["sql"]) for row in self.database.rows(Statement(
            "SELECT name, sql FROM sqlite_master WHERE type = 'index' AND tbl_name = ? AND sql IS NOT NULL", [table]))}

    def restore(self, statements: Mapping[str, Statement]) -> None:
        existing = {row["name"] for row in self.database.rows(Statement("SELECT name FROM sqlite_master WHERE type = 'index'"))}
        for name, statement in statements.items():
            if name in existing:
                continue
            self.database.update(statement)
