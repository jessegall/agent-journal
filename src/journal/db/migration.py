from typing import ClassVar

from journal.db.connection import Connection


class Migration:
    """One numbered change to the database after the schema was first created: its statements, run in order, or an up of its own."""

    number: ClassVar[int]
    statements: ClassVar[tuple[str, ...]] = ()

    def up(self, connection: Connection) -> None:
        for statement in self.statements:
            connection.execute(statement)
