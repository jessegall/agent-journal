from collections.abc import Callable, Sequence
from typing import TypeVar, cast
from weakref import WeakKeyDictionary

from core.base.database.database import Database
from core.base.database.statement import Statement

T = TypeVar("T")
KEPT: WeakKeyDictionary[Database, dict[str, tuple[tuple[int, int, str], object]]] = WeakKeyDictionary()


class KeptRows:
    """What was read from a table that seldom changes, kept on the connection until the table
    changes, by its row count, the sum of its row version_total and its last_updated_at change
    time, so each hook asks the table for one count and no rows."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def read(self, table: str, loader: Callable[[], T], condition: str = "1 = 1", parameters: Sequence[object] = ()) -> T:
        count, version_total, last_updated_at = self.database.rows(Statement(f"SELECT count(*), coalesce(sum(version), 0), max(updated_at) FROM {table} WHERE {condition}", list(parameters)))[0]
        signature = (count, version_total, last_updated_at or "")
        cache_key = f"{table}:{condition}:{tuple(parameters)}"
        kept = KEPT.setdefault(self.database, {})
        if cache_key in kept and kept[cache_key][0] == signature:
            return cast(T, kept[cache_key][1])
        loaded = loader()
        kept[cache_key] = (signature, loaded)
        return loaded
