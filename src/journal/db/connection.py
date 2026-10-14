import sqlite3
import threading
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator


class Connection:
    """The one place SQL is executed. Each thread reads on a sqlite connection of its own; writes take the one lock, so the threaded server never contends."""

    def __init__(self, path: Path) -> None:
        self.path = path
        self._threads = threading.local()
        self._writing = threading.RLock()
        self._open: list[sqlite3.Connection] = []

    def execute(self, sql: str, params: tuple = ()) -> sqlite3.Cursor:
        return self._local().execute(sql, params)

    def one(self, sql: str, params: tuple = ()) -> sqlite3.Row | None:
        return self.execute(sql, params).fetchone()

    def all(self, sql: str, params: tuple = ()) -> list[sqlite3.Row]:
        return self.execute(sql, params).fetchall()

    @contextmanager
    def transaction(self) -> Iterator["Connection"]:
        """Holds the write lock for the block; committed at the end, rolled back on an exception. Nested blocks join the outer one."""
        with self._writing:
            local = self._local()
            if local.in_transaction:
                yield self
                return
            local.execute("BEGIN IMMEDIATE")
            try:
                yield self
            except BaseException:
                local.execute("ROLLBACK")
                raise
            local.execute("COMMIT")

    def close(self) -> None:
        for open_ in self._open:
            open_.close()
        self._open.clear()

    def _local(self) -> sqlite3.Connection:
        local = getattr(self._threads, "connection", None)
        if local is None:
            local = sqlite3.connect(self.path, autocommit=True, check_same_thread=False)
            local.row_factory = sqlite3.Row
            local.execute("PRAGMA journal_mode=WAL")
            local.execute("PRAGMA foreign_keys=ON")
            local.execute("PRAGMA busy_timeout=5000")
            self._threads.connection = local
            self._open.append(local)
        return local
