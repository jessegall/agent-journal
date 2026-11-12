from collections.abc import Sequence
from typing import TypeVar, cast

from engine.database.kept_rows import KEPT_ROW_COUNT
from engine.model.model import Model
from engine.model.view_model import ViewModel
from engine.errors.missing_rows_error import MissingRowsError
from engine.query.queries import Queries
from engine.query.conditions.among import Among
from engine.listener.rows.cached_event_row import CachedEventRow

EVENT_ROWS_REASON = "every row the logged events name is read once for the listeners"

M = TypeVar("M", bound=Model | ViewModel)


class EventRows:
    """Shares repository rows between listeners and checks external changes in batches; a view has no version
    to check, so its rows are read again in each new generation. A rollback drops every row cached before it,
    since a write after it can reuse the version of a row the rollback undid."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries
        self.known: dict[tuple[type[Model | ViewModel], int], dict[str, CachedEventRow]] = {}

    def current_generation(self) -> tuple[int, int]:
        database = self.queries.database
        return database.change_mark()[0], database.write_rollback_count

    def find(self, model: type[M], row_id: int) -> M | None:
        self.prepare(model, [row_id])
        return cast(M | None, self.known[(model, row_id)][self.cache_name(model)].row)

    def required(self, model: type[M], row_id: int) -> M:
        row = self.find(model, row_id)
        if row is None:
            raise MissingRowsError(model.cli_name, [row_id])
        return row

    def required_index(self, model: type[M], row_ids: Sequence[int]) -> dict[int, M]:
        self.prepare(model, row_ids)
        name = self.cache_name(model)
        rows = {row_id: self.known[(model, row_id)][name].row for row_id in dict.fromkeys(row_ids)}
        missing = [row_id for row_id, row in rows.items() if row is None]
        if missing:
            raise MissingRowsError(model.cli_name, missing)
        return cast(dict[int, M], rows)

    def prepare(self, model: type[M], row_ids: Sequence[int]) -> None:
        if len(self.known) >= KEPT_ROW_COUNT:
            self.known.clear()
        generation = self.current_generation()
        name = self.cache_name(model)
        stale = [row_id for row_id in dict.fromkeys(row_ids)
                 if name in self.known.get((model, row_id), {}) and self.known[(model, row_id)][name].generation != generation]
        for row_id in [row_id for row_id in stale if self.known[(model, row_id)][name].generation[1] != generation[1]]:
            self.known[(model, row_id)].pop(name)
        stale = [row_id for row_id in stale if name in self.known[(model, row_id)]]
        if stale and issubclass(model, ViewModel):
            for row_id in stale:
                self.known[(model, row_id)].pop(name)
        elif stale:
            query = self.queries.query(model).with_removed().matching(Among("id", stale))
            select = query.scoped(query.select).column("id, version")
            versions = {row[0]: row[1] for row in self.queries.database.rows(select.statement())}
            for row_id in stale:
                cached = self.known[(model, row_id)].pop(name)
                if cached.version == versions.get(row_id):
                    self.known[(model, row_id)][name] = CachedEventRow(cached.row, generation)
        missing = [row_id for row_id in dict.fromkeys(row_ids) if name not in self.known.get((model, row_id), {})]
        if not missing:
            return
        rows = {self.row_key(row): row for row in self.queries.query(model).with_removed().matching(Among("id", missing)).every_row(EVENT_ROWS_REASON)}
        for row_id in missing:
            self.known.setdefault((model, row_id), {})[name] = CachedEventRow(rows.get(row_id), generation)

    def remember(self, row: Model) -> None:
        self.known[(type(row), row.id)] = {self.cache_name(type(row)): CachedEventRow(row, self.current_generation())}

    def remove(self, row: Model) -> None:
        self.known[(type(row), row.id)] = {self.cache_name(type(row)): CachedEventRow(None, self.current_generation())}

    @staticmethod
    def row_key(row: Model | ViewModel) -> int:
        return row.id if isinstance(row, Model) else getattr(row, row.key)

    def cache_name(self, model: type[Model | ViewModel]) -> str:
        query = self.queries.query(model)
        return f"listeners.event_row:{query.scoped(query.select).conditions}"
