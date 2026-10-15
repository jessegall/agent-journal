import sqlite3
import threading
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator


class Connection:
    """The one place SQL is executed. Each thread reads on a sqlite connection leased from a pool and returned with release(), so a server thread that ends leaves nothing open; writes take the one lock, so the threaded server never contends."""

    def __init__(self, path: Path) -> None:
        self.path = path
        self._threads = threading.local()
        self._writing = threading.RLock()
        self._pooling = threading.Lock()
        self._open: list[sqlite3.Connection] = []
        self._free: list[sqlite3.Connection] = []

    def release(self) -> None:
        """Returns this thread's connection to the pool; the next thread takes it instead of opening another."""
        local = getattr(self._threads, "connection", None)
        if local is None:
            return
        self._threads.connection = None
        with self._pooling:
            self._free.append(local)

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
            local = self._leased()
            self._threads.connection = local
        return local

    def _leased(self) -> sqlite3.Connection:
        with self._pooling:
            if self._free:
                return self._free.pop()
            local = sqlite3.connect(self.path, autocommit=True, check_same_thread=False)
            local.row_factory = sqlite3.Row
            local.execute("PRAGMA journal_mode=WAL")
            local.execute("PRAGMA foreign_keys=ON")
            local.execute("PRAGMA busy_timeout=5000")
            self._open.append(local)
            return local
