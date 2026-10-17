from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration


class ClearCountsOfTheOldShape(Migration):
    """Counts named without their workflow were kept per agent alone; each workflow now keeps its own, so the old ones go, as they would have at the agent's session end."""

    number: ClassVar[int] = 6

    def up(self, connection: Connection) -> None:
        connection.execute("DELETE FROM counts WHERE name NOT LIKE 'charts:%'")
