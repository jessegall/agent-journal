from collections.abc import Callable, Sequence
from weakref import WeakKeyDictionary

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.model.model import Model

KEPT: WeakKeyDictionary[Database, dict[str, tuple[tuple[int, str], Sequence[Model]]]] = WeakKeyDictionary()


class KeptRows:
    """Rows of a table that seldom change, kept on the connection for as long as the table's row count and newest change
    time stay the same, so each hook asks the table for one count and not for all its rows."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def of(self, table: str, loader: Callable[[], Sequence[Model]], where: str = "1 = 1", parameters: Sequence[object] = ()) -> Sequence[Model]:
        count, newest = self.database.rows(Statement(f"SELECT count(*), max(updated_at) FROM {table} WHERE {where}", list(parameters)))[0]
        signature = (count, newest or "")
        name = f"{table}:{where}:{tuple(parameters)}"
        kept = KEPT.setdefault(self.database, {})
        if name in kept and kept[name][0] == signature:
            return kept[name][1]
        rows = tuple(loader())
        kept[name] = (signature, rows)
        return rows
