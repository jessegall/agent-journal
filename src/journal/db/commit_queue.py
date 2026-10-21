from typing import Callable

from journal.db.connection import Connection


class CommitQueue:
    """Work that waits for the open transaction to commit, run at once when none is open; the one way outside the repositories to reach the connection's commit."""

    def __init__(self, connection: Connection) -> None:
        self.connection = connection

    def add(self, work: Callable[[], None]) -> None:
        self.connection.commit_callback(work)
