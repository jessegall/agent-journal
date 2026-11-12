from collections.abc import Callable, Sequence
from dataclasses import replace
from typing import TYPE_CHECKING, TypeVar, cast

from engine.database.database import Database
from engine.database.kept_value import KeptValue
from engine.database.statement import Statement

if TYPE_CHECKING:
    from engine.query.query import Query

T = TypeVar("T")
Signature = tuple[tuple[object, ...], ...]

KEPT_ROW_COUNT = 20000


class KeptRows:
    """Caches reads and refreshes them when the rows of their query change, also a read that spans several
    queries. The query names the rows and carries the scope in force; a read whose rows depend on the agent that
    asks is kept with owner_read, apart for each agent and environment of the scope in force."""

    def __init__(self, database: Database) -> None:
        self.database = database
        database.kept_rows = self
        self.kept: dict[str, KeptValue] = {}
        self.write_rollback_count = database.write_rollback_count

    def read(self, source: "Query", loader: Callable[[], T], *, name: str) -> T:
        """Keeps what the loader read for a query until the rows of that query change."""
        select = source.kept_select()
        if select.is_empty:
            return loader()
        return self.kept_value(self.query_key(source, name), lambda _signature: loader(), select.signature_statement())

    def owner_read(self, source: "Query", loader: Callable[[], T], *, name: str) -> T:
        return self.read(source, loader, name=f"{name}:{self.database.row_owner}")

    def read_across(self, sources: "Sequence[Query]", loader: Callable[[], T], *, name: str) -> T:
        """Keeps what the loader read from the rows of several queries until any of them changes."""
        signatures = tuple(source.kept_select().signature_statement() for source in sources)
        key = "|".join(self.query_key(source, name) for source in sources)
        return self.kept_value(key, lambda _signature: loader(), Statement.all_joined(signatures, " UNION ALL "))

    def read_matching_signature(self, source: "Query", loader: Callable[[Signature], T], *, name: str) -> T:
        """Keeps what the loader read for the signature of a query's rows, which the loader is handed."""
        return self.kept_value(self.query_key(source, name), loader, source.kept_select().signature_statement())

    def read_newest(self, source: "Query", loader: Callable[[], T], *, name: str) -> T:
        """Keeps what the loader read until the newest row of the query changes."""
        select = source.kept_select()
        if select.is_empty:
            return loader()
        return self.kept_value(self.query_key(source, name), lambda _signature: loader(), select.newest_signature_statement())

    def read_signed(self, signature: Statement, loader: Callable[[], T], *, name: str) -> T:
        """Keeps what the loader read until the given signature statement answers otherwise: for the database
        layer's own reads, which have no model to query."""
        return self.kept_value(f"{name}:{signature.sql}:{tuple(signature.parameters)}", lambda _signature: loader(), signature)

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

    def update(self, source: "Query", updater: Callable[[T], T], *, name: str) -> None:
        """Changes a kept read of the query in place, after a write the caller knows the outcome of."""
        self.check_rollback()
        previous = self.kept.pop(self.query_key(source, name), None)
        if previous is None:
            return
        self.read(source, lambda: updater(cast(T, previous.value)), name=name)

    def scoped_current(self, loader: Callable[[], T], *, name: str) -> T:
        with self.database.consistent_read():
            signature = self.database.content_mark()
            return self.kept_value(f"current:{name}:{self.database.scope_environment_id}", lambda _signature: loader(),
                                   Statement("SELECT ?, ?, ?", signature))

    def check_rollback(self) -> None:
        if self.write_rollback_count != self.database.write_rollback_count:
            self.kept = {key: replace(value, change_mark=(-1, -1)) for key, value in self.kept.items()}
            self.write_rollback_count = self.database.write_rollback_count

    @staticmethod
    def query_key(query: "Query", name: str) -> str:
        conditions = query.kept_select().conditions_statement()
        return f"{name}:{conditions.sql}:{tuple(conditions.parameters)}"
