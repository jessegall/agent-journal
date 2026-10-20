import sqlite3
import threading
import weakref
from contextlib import contextmanager
from pathlib import Path
from typing import Callable, Iterator

from journal.support.masks import Masks


class Connection:
    """The one place SQL is executed, a secret value masked out of every text it writes. Each thread reads on a sqlite connection leased from a pool, returned with release() or, by any thread that never says so, once the thread is gone, so no thread that ends leaves one open; writes take the one lock, so the threaded server never contends."""

    def __init__(self, path: Path, masks: Masks) -> None:
        self.path, self.masks = path, masks
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
        self._threads.returned.detach()
        self._given_back(local)

    def _given_back(self, local: sqlite3.Connection) -> None:
        with self._pooling:
            self._free.append(local)

    def execute(self, sql: str, params: tuple = ()) -> sqlite3.Cursor:
        """Every text it is given masked first, so no secret value is ever written."""
        return self._local().execute(sql, tuple(self.masks.masked(p) if isinstance(p, str) else p for p in params))

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
            self._threads.committed = []
            try:
                yield self
            except BaseException:
                local.execute("ROLLBACK")
                self._threads.committed = []
                raise
            local.execute("COMMIT")
        for work in self._threads.__dict__.pop("committed", []):
            work()

    def after_commit(self, work: Callable[[], None]) -> None:
        """Runs once the open write commits, and never if it rolls back; at once when no write is open."""
        if self._local().in_transaction:
            self._threads.committed.append(work)
            return
        work()

    def close(self) -> None:
        for open_ in self._open:
            open_.close()
        self._open.clear()

    def _local(self) -> sqlite3.Connection:
        local = getattr(self._threads, "connection", None)
        if local is None:
            local = self._leased()
            self._threads.connection = local
            self._threads.returned = weakref.finalize(threading.current_thread(), self._given_back, local)
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
