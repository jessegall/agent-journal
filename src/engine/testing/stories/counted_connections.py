import sqlite3
from pathlib import Path
from unittest.mock import patch

from engine.journal.journal_home import JournalHome


class CountedConnections:
    """Counts the connections opened to a journal's database file while it is entered, for a story that proves
    background work opens none."""

    def __init__(self, home: JournalHome) -> None:
        self.database_file = home.database
        self.connections: list[sqlite3.Connection] = []
        self.connect = sqlite3.connect
        self.patched_connect = patch.object(sqlite3, "connect", self.counted_connect)

    def __enter__(self) -> "CountedConnections":
        self.patched_connect.start()
        return self

    def __exit__(self, *exception_details: object) -> None:
        self.patched_connect.stop()

    def counted_connect(self, target: str | Path, *arguments: object, **options: object) -> sqlite3.Connection:
        connection = self.connect(target, *arguments, **options)
        if Path(str(target)) == self.database_file:
            self.connections.append(connection)
        return connection

    @property
    def count(self) -> int:
        return len(self.connections)

    def open_count(self) -> int:
        return sum(1 for connection in self.connections if is_open(connection))


def is_open(connection: sqlite3.Connection) -> bool:
    try:
        connection.total_changes
    except sqlite3.ProgrammingError:
        return False
    return True
