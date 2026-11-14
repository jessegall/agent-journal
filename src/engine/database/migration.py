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

    # The columns the table has now, which a migration reads to know whether its change was made already.
    @staticmethod
    def column_names(database: Database, table: str) -> set[str]:
        return {row["name"] for row in database.rows(Statement(f"PRAGMA table_info({table})"))}

    # The path of the main database file, empty for a database in memory.
    @staticmethod
    def database_file(database: Database) -> str:
        return database.rows(Statement("PRAGMA database_list"))[0][2]

    # The rows of a read a migration makes in its own SQL, against the tables as they stand at its number.
    @staticmethod
    def selected(database: Database, sql: str, parameters: Sequence[object]) -> list[tuple[object, ...]]:
        return [tuple(row) for row in database.rows(Statement(sql, parameters))]
