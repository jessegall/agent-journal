from collections.abc import Callable, Sequence
from dataclasses import replace
from typing import TypeVar, cast

from engine.database.database import Database
from engine.database.kept_value import KeptValue
from engine.database.statement import Statement

T = TypeVar("T")
Signature = tuple[tuple[object, ...], ...]

KEPT_ROW_COUNT = 20000


class KeptRows:
    """Caches scoped reads and refreshes them when their database data changes. A read whose rows depend on
    the agent that asks is kept with owner_read, apart for each agent and environment of the scope in force."""

    def __init__(self, database: Database) -> None:
        self.database = database
        database.kept_rows = self
        self.kept: dict[str, KeptValue] = {}
        self.write_rollback_count = database.write_rollback_count

    def read(self, table: str, loader: Callable[[], T], condition: str = "1 = 1", parameters: Sequence[object] = (), *, name: str) -> T:
        return self.kept_value(self.key(table, condition, parameters, name), lambda _signature: loader(), self.signature_read(table, condition, parameters))

    def owner_read(self, table: str, loader: Callable[[], T], condition: str = "1 = 1", parameters: Sequence[object] = (), *, name: str) -> T:
        return self.read(table, loader, condition, parameters, name=f"{name}:{self.database.row_owner}")

    def read_matching_signature(self, table: str, loader: Callable[[Signature], T], *, name: str) -> T:
        return self.kept_value(self.key(table, "1 = 1", (), name), loader, self.signature_read(table, "1 = 1", ()))

    def read_newest(self, table: str, loader: Callable[[], T], condition: str, parameters: Sequence[object], *, name: str) -> T:
        return self.kept_value(self.key(table, condition, parameters, name), lambda _signature: loader(), Statement(f"SELECT id, version, updated_at FROM {table} WHERE {condition} ORDER BY id DESC LIMIT 1", list(parameters)))

    def kept_value(self, cache_key: str, loader: Callable[[Signature], T], signature_read: Statement) -> T:
        self.check_rollback()
        change_mark = self.database.change_mark()
        if cache_key in self.kept and self.kept[cache_key].change_mark == change_mark:
            return cast(T, self.kept[cache_key].value)
        signature = tuple(tuple(row) for row in self.database.rows(signature_read))
        if cache_key in self.kept and self.kept[cache_key].signature == signature:
            self.kept[cache_key] = replace(self.kept[cache_key], change_mark=change_mark)
            return cast(T, self.kept[cache_key].value)
        if len(self.kept) >= KEPT_ROW_COUNT:
            self.kept.clear()
        loaded = loader(signature)
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

    def scoped_current(self, loader: Callable[[], T], *, name: str) -> T:
        with self.database.consistent_read():
            signature = self.database.content_mark()
            return self.kept_value(f"current:{name}:{self.database.scope_environment_id}", lambda _signature: loader(),
                                   Statement("SELECT ?, ?, ?", signature))

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
    def signature_read(table: str, condition: str, parameters: Sequence[object]) -> Statement:
        return Statement(f"SELECT count(*), coalesce(sum(id), 0), coalesce(sum(version), 0), max(updated_at) FROM {table} WHERE {condition}", list(parameters))

    @staticmethod
    def key(table: str, condition: str, parameters: Sequence[object], name: str) -> str:
        return f"{name}:{table}:{condition}:{tuple(parameters)}"
