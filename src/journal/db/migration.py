from typing import ClassVar

from journal.db.connection import Connection


class Migration:
    """One numbered change to the database after the schema was first created."""

    number: ClassVar[int]

    def up(self, connection: Connection) -> None: ...
