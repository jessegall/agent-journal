from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration


class TriggerPhrases(Migration):
    """A trigger's words are its phrases: the column is renamed, or carried into the phrases column the schema already added when both are there."""

    number: ClassVar[int] = 21

    def apply(self, connection: Connection) -> None:
        columns = {row["name"] for row in connection.all("PRAGMA table_info(triggers)")}
        if "words" in columns and "phrases" in columns:
            connection.execute("UPDATE triggers SET phrases = words")
            connection.execute("ALTER TABLE triggers DROP COLUMN words")
        elif "words" in columns:
            connection.execute("ALTER TABLE triggers RENAME COLUMN words TO phrases")
