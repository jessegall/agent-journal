from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration


class TriggerPhrases(Migration):
    """A trigger's words are its phrases: the column is renamed in place of the empty phrases column the schema already added."""

    number: ClassVar[int] = 21

    def apply(self, connection: Connection) -> None:
        self.column_rename(connection, "triggers", "words", "phrases")
