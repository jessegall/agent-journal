import sqlite3
from collections.abc import Iterator
from contextlib import contextmanager
from pathlib import Path
from unittest.mock import patch


class CountedConnections:
    """The connections to one database file opened while the count runs."""

    def __init__(self, database: Path) -> None:
        self.database = database
        self.connections: list[sqlite3.Connection] = []

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


@contextmanager
def counted_connections(database: Path) -> Iterator[CountedConnections]:
    counted = CountedConnections(database)
    connect = sqlite3.connect

    def counted_connect(target, *arguments, **options) -> sqlite3.Connection:
        connection = connect(target, *arguments, **options)
        if Path(str(target)) == database:
            counted.connections.append(connection)
        return connection

    with patch.object(sqlite3, "connect", counted_connect):
        yield counted
