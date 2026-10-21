import sqlite3
import threading
import weakref
from contextlib import contextmanager
from pathlib import Path
from typing import Callable, Iterator

from journal.db.empty_result import EmptyResult
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
        local = getattr(self._threads, "connection", None)
        if local is None:
            return
        self._threads.connection = None
        self._threads.returned.detach()
        self._returned(local)

    def _returned(self, local: sqlite3.Connection) -> None:
        with self._pooling:
            self._free.append(local)

    def execute(self, sql: str, params: tuple = ()) -> sqlite3.Cursor:
        return self._local().execute(sql, self.masks.masked(params))

    def one(self, sql: str, params: tuple = ()) -> sqlite3.Row | None:
        return self.execute(sql, params).fetchone()

    def result(self, sql: str, params: tuple = ()) -> sqlite3.Row:
        row = self.one(sql, params)
        if row is None:
            raise EmptyResult(sql)
        return row

    def all(self, sql: str, params: tuple = ()) -> list[sqlite3.Row]:
        return self.execute(sql, params).fetchall()

    @contextmanager
    def transaction(self) -> Iterator["Connection"]:
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

    def commit_callback(self, work: Callable[[], None]) -> None:
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
            self._threads.returned = weakref.finalize(threading.current_thread(), self._returned, local)
        return local

    def _leased(self) -> sqlite3.Connection:
        with self._pooling:
            if self._free:
                return self._free.pop()
            local = sqlite3.connect(self.path, autocommit=True, check_same_thread=False)
            local.row_factory = sqlite3.Row
            local.execute("PRAGMA journal_mode=WAL")
            local.execute("PRAGMA synchronous=NORMAL")
            local.execute("PRAGMA foreign_keys=ON")
            local.execute("PRAGMA busy_timeout=5000")
            self._open.append(local)
            return local
