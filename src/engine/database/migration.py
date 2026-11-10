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
