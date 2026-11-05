from collections.abc import Callable, Sequence
from dataclasses import replace
from typing import TypeVar, cast

from core.base.database.database import Database
from core.base.database.kept_value import KeptValue
from core.base.database.statement import Statement

T = TypeVar("T")


class KeptRows:
    """Keeps each caller's table reads until the table changes or a transaction rolls back."""

    def __init__(self, database: Database) -> None:
        self.database = database
        self.kept: dict[str, KeptValue] = {}
        self.write_rollback_count = database.write_rollback_count

    def read(self, table: str, loader: Callable[[], T], condition: str = "1 = 1", parameters: Sequence[object] = (), *, name: str) -> T:
        self.check_rollback()
        cache_key = self.key(table, condition, parameters, name)
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

    def update(self, table: str, updater: Callable[[T], T], condition: str = "1 = 1", parameters: Sequence[object] = (), *, name: str) -> None:
        self.check_rollback()
        previous = self.kept.pop(self.key(table, condition, parameters, name), None)
        if previous is None:
            return
        self.read(table, lambda: updater(cast(T, previous.value)), condition, parameters, name=name)

    def scoped_read(self, table: str, loader: Callable[[], T], condition: str = "1 = 1", parameters: Sequence[object] = (), *, name: str) -> T:
        return self.read(table, loader, *self.condition_with_scope(condition, parameters), name=name)

    def scoped_update(self, table: str, updater: Callable[[T], T], condition: str = "1 = 1", parameters: Sequence[object] = (), *, name: str) -> None:
        self.update(table, updater, *self.condition_with_scope(condition, parameters), name=name)

    def condition_with_scope(self, condition: str, parameters: Sequence[object]) -> tuple[str, Sequence[object]]:
        environment_id = self.database.scope_environment_id
        return (condition, parameters) if environment_id is None else (f"environment_id = ? AND {condition}", [environment_id, *parameters])

    def check_rollback(self) -> None:
        if self.write_rollback_count != self.database.write_rollback_count:
            self.kept = {key: replace(value, change_mark=(-1, -1)) for key, value in self.kept.items()}
            self.write_rollback_count = self.database.write_rollback_count

    @staticmethod
    def key(table: str, condition: str, parameters: Sequence[object], name: str) -> str:
        return f"{name}:{table}:{condition}:{tuple(parameters)}"
