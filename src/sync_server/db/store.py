import sqlite3
import threading
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator


class Store:
    """The team server's one door to its database: every statement runs here, one writer at a time."""

    def __init__(self, path: Path) -> None:
        self.connection = sqlite3.connect(path, check_same_thread=False, isolation_level=None)
        self.connection.row_factory = sqlite3.Row
        self.connection.execute("PRAGMA journal_mode=WAL")
        self.lock = threading.RLock()
        self.depth = 0

    def execute(self, sql: str, params: tuple = ()) -> sqlite3.Cursor:
        with self.lock:
            return self.connection.execute(sql, params)

    def script(self, sql: str) -> None:
        with self.lock:
            for statement in (part.strip() for part in sql.split(";")):
                if statement:
                    self.connection.execute(statement)

    def one(self, sql: str, params: tuple = ()) -> sqlite3.Row | None:
        return self.execute(sql, params).fetchone()

    def all(self, sql: str, params: tuple = ()) -> list[sqlite3.Row]:
        return self.execute(sql, params).fetchall()

    @contextmanager
    def transaction(self) -> Iterator["Store"]:
        with self.lock:
            if self.depth:
                self.depth += 1
                try:
                    yield self
                finally:
                    self.depth -= 1
                return
            self.connection.execute("BEGIN IMMEDIATE")
            self.depth = 1
            try:
                yield self
            except BaseException:
                self.connection.execute("ROLLBACK")
                raise
            else:
                self.connection.execute("COMMIT")
            finally:
                self.depth = 0

    def close(self) -> None:
        self.connection.close()
