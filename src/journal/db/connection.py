import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator


class Connection:
    """The one place SQL is executed."""

    def __init__(self, path: Path) -> None: ...

    def execute(self, sql: str, params: tuple = ()) -> sqlite3.Cursor: ...

    def one(self, sql: str, params: tuple = ()) -> sqlite3.Row | None: ...

    def all(self, sql: str, params: tuple = ()) -> list[sqlite3.Row]: ...

    @contextmanager
    def transaction(self) -> Iterator["Connection"]: ...

    def close(self) -> None: ...
