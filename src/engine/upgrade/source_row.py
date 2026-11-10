import sqlite3
from typing import Any


class SourceRow(sqlite3.Row):
    """A row of a version 4 table in which a column the table lacks reads as nothing, so a journal of an older
    version 4 release, whose tables lack later columns, is carried as far as its columns go."""

    def __getitem__(self, key: Any, /) -> Any:
        try:
            return super().__getitem__(key)
        except IndexError:
            if isinstance(key, str):
                return None
            raise
