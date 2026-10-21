from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration


class BlankSessionNulls(Migration):
    """A worker the user dispatched and a command output no agent ran hold no session: the blank they were saved with before is NULL."""

    number: ClassVar[int] = 33

    def apply(self, connection: Connection) -> None:
        connection.execute("UPDATE workers SET dispatcher = NULL WHERE dispatcher = ''")
        connection.execute("UPDATE command_outputs SET session = NULL WHERE session = ''")
