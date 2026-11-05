from collections.abc import Callable, Sequence
from dataclasses import replace
from typing import TypeVar, cast
from weakref import WeakKeyDictionary
from contextlib import nullcontext

from core.base.database.database import Database
from core.base.database.kept_value import KeptValue
from core.base.database.statement import Statement

T = TypeVar("T")
KEPT: WeakKeyDictionary[Database, dict[str, KeptValue]] = WeakKeyDictionary()


class KeptRows:
    """What was read from a table that seldom changes, kept on the connection until the table
    changes, by its row count, the sum of its row version_total and its last_updated_at change
    time. While no connection has written to the database at all the table is not asked either."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def read(self, table: str, loader: Callable[[], T], condition: str = "1 = 1", parameters: Sequence[object] = ()) -> T:
        cache_key = f"{table}:{condition}:{tuple(parameters)}"
        kept = KEPT.setdefault(self.database, {})
        change_mark = self.database.change_mark()
        if cache_key in kept and kept[cache_key].change_mark == change_mark:
            return cast(T, kept[cache_key].value)
        count, version_total, last_updated_at = self.database.rows(Statement(f"SELECT count(*), coalesce(sum(version), 0), max(updated_at) FROM {table} WHERE {condition}", list(parameters)))[0]
        signature = (count, version_total, last_updated_at or "")
        if cache_key in kept and kept[cache_key].signature == signature:
            kept[cache_key] = replace(kept[cache_key], change_mark=change_mark)
            return cast(T, kept[cache_key].value)
        with self.database.tally.reread(table) if cache_key in kept else nullcontext():
            loaded = loader()
        kept[cache_key] = KeptValue(signature, change_mark, loaded)
        return loaded
