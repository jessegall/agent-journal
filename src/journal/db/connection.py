import sqlite3
import threading
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator


class Connection:
    """The one place SQL is executed. Each thread reads on a sqlite connection of its own; writes take the one lock, so the threaded server never contends."""

    def __init__(self, path: Path) -> None: ...

    def execute(self, sql: str, params: tuple = ()) -> sqlite3.Cursor: ...

    def one(self, sql: str, params: tuple = ()) -> sqlite3.Row | None: ...

    def all(self, sql: str, params: tuple = ()) -> list[sqlite3.Row]: ...

    @contextmanager
    def transaction(self) -> Iterator["Connection"]:
        """Holds the write lock for the block; committed at the end, rolled back on an exception."""
        ...

    def close(self) -> None: ...

    def _local(self) -> sqlite3.Connection: ...
