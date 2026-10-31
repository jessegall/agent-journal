from typing import ClassVar

from core.base.database.database import Database
from core.base.database.statement import Statement


class Migration:
    """One change to the database's tables, run once."""

    number: ClassVar[int]
    statements: ClassVar[tuple[str, ...]]

    def run(self, database: Database) -> None:
        for sql in self.statements:
            database.update(Statement(sql))
