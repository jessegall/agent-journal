from pathlib import Path

from journal.db.connection import Connection


class JournalBackup:
    """A copy of the whole journal database, made with SQLite's online backup while the journal runs."""

    def __init__(self, connection: Connection) -> None:
        self.connection = connection

    def write(self, target: Path) -> None:
        self.connection.backup(target)
