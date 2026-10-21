from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration

RENAMED = {"Idle": "Stop", "TurnWritten": "TurnDisplayed"}


class EventRenames(Migration):
    """The record's entries of the hook events renamed for the plain-name rules go by the new names, so a query over the record finds the old ones too."""

    number: ClassVar[int] = 23

    def up(self, connection: Connection) -> None:
        for old, new in RENAMED.items():
            connection.execute("UPDATE entries SET kind = ? WHERE kind = ?", (new, old))
