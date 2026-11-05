from collections.abc import Callable, Sequence
from dataclasses import replace
from typing import TypeVar, cast

from core.base.database.database import Database
from core.base.database.kept_value import KeptValue
from core.base.database.statement import Statement

T = TypeVar("T")


class KeptRows:
    """Keeps each caller's committed table reads until the table changes."""

    def __init__(self, database: Database) -> None:
        self.database = database
        self.kept: dict[str, KeptValue] = {}

    def read(self, table: str, loader: Callable[[], T], condition: str = "1 = 1", parameters: Sequence[object] = (), *, name: str) -> T:
        if self.database.has_uncommitted_changes:
            return loader()
        cache_key = f"{name}:{table}:{condition}:{tuple(parameters)}"
        change_mark = self.database.change_mark()
        if cache_key in self.kept and self.kept[cache_key].change_mark == change_mark:
            return cast(T, self.kept[cache_key].value)
        count, version_total, last_updated_at = self.database.rows(Statement(f"SELECT count(*), coalesce(sum(version), 0), max(updated_at) FROM {table} WHERE {condition}", list(parameters)))[0]
        signature = (count, version_total, last_updated_at or "")
        if cache_key in self.kept and self.kept[cache_key].signature == signature:
            self.kept[cache_key] = replace(self.kept[cache_key], change_mark=change_mark)
            return cast(T, self.kept[cache_key].value)
        loaded = loader()
        self.kept[cache_key] = KeptValue(signature, change_mark, loaded)
        return loaded
