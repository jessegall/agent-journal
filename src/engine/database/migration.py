from collections.abc import Sequence
from typing import ClassVar

from engine.database.database import Database
from engine.database.statement import Statement


class Migration:
    """One change to the database's tables, run once."""

    number: ClassVar[int]
    statements: ClassVar[Sequence[str]]

    def run(self, database: Database) -> None:
        for sql in self.statements:
            database.update(Statement(sql))

    @staticmethod
    def column_names(database: Database, table: str) -> set[str]:
        """The columns the table has now, which a migration reads to know whether its change was made already."""
        return {row["name"] for row in database.rows(Statement(f"PRAGMA table_info({table})"))}

    @staticmethod
    def database_file(database: Database) -> str:
        """The path of the main database file, empty for a database in memory."""
        return database.rows(Statement("PRAGMA database_list"))[0][2]

    @staticmethod
    def selected(database: Database, sql: str, parameters: Sequence[object]) -> list[tuple[object, ...]]:
        """The rows of a read a migration makes in its own SQL, against the tables as they stand at its number."""
        return [tuple(row) for row in database.rows(Statement(sql, parameters))]
