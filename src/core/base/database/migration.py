from typing import ClassVar

from core.base.database.database import Database
from core.base.database.statement import Statement


class Migration:
    """One change to the schema, run once by its module and number, statement by statement inside one transaction
    with the row that records it."""

    number: ClassVar[int]
    statements: ClassVar[tuple[str, ...]]

    def run(self, database: Database) -> None:
        for sql in self.statements:
            database.update(Statement(sql))
