from collections.abc import Callable, Sequence
from typing import TypeVar, cast
from weakref import WeakKeyDictionary

from core.base.database.database import Database
from core.base.database.statement import Statement

T = TypeVar("T")
KEPT: WeakKeyDictionary[Database, dict[str, tuple[tuple[int, int, str], object]]] = WeakKeyDictionary()


class KeptRows:
    """What was read from a table that seldom changes, kept on the connection until the table changes, by its row count,
    the sum of its row versions and its newest change time, so each hook asks the table for one count and no rows."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def of(self, table: str, loader: Callable[[], T], where: str = "1 = 1", parameters: Sequence[object] = ()) -> T:
        count, versions, newest = self.database.rows(Statement(f"SELECT count(*), coalesce(sum(version), 0), max(updated_at) FROM {table} WHERE {where}", list(parameters)))[0]
        signature = (count, versions, newest or "")
        name = f"{table}:{where}:{tuple(parameters)}"
        kept = KEPT.setdefault(self.database, {})
        if name in kept and kept[name][0] == signature:
            return cast(T, kept[name][1])
        loaded = loader()
        kept[name] = (signature, loaded)
        return loaded
