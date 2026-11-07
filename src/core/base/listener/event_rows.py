from collections.abc import Sequence
from dataclasses import dataclass
from typing import TypeVar, cast

from core.base.database.kept_rows import KEPT_ROW_COUNT
from core.base.model.model import Model
from core.base.missing_rows_error import MissingRowsError
from core.base.query.queries import Queries
from core.base.query.conditions.among import Among

M = TypeVar("M", bound=Model)


@dataclass(frozen=True)
class CachedEventRow:
    row: Model | None
    generation: tuple[int, int]

    @property
    def version(self) -> int | None:
        return self.row.version if self.row is not None else None


class EventRows:
    """Shares repository rows between listeners and checks external changes and rollbacks in batches."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries
        self.known: dict[tuple[type[Model], int], dict[str, CachedEventRow]] = {}

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

    def prepare(self, model: type[M], row_ids: Sequence[int]) -> None:
        if len(self.known) >= KEPT_ROW_COUNT:
            self.known.clear()
        generation = self.current_generation()
        name = self.cache_name(model)
        stale = [row_id for row_id in dict.fromkeys(row_ids)
                 if name in self.known.get((model, row_id), {}) and self.known[(model, row_id)][name].generation != generation]
        if stale:
            query = self.queries.query(model).matching(Among("id", stale))
            select = query.scoped(query.select).column("id, version")
            versions = {row[0]: row[1] for row in self.queries.database.rows(select.statement())}
            for row_id in stale:
                cached = self.known[(model, row_id)].pop(name)
                if cached.version == versions.get(row_id):
                    self.known[(model, row_id)][name] = CachedEventRow(cached.row, generation)
        missing = [row_id for row_id in dict.fromkeys(row_ids) if name not in self.known.get((model, row_id), {})]
        if not missing:
            return
        rows = {row.id: row for row in self.queries.query(model).matching(Among("id", missing)).all_rows()}
        for row_id in missing:
            self.known.setdefault((model, row_id), {})[name] = CachedEventRow(rows.get(row_id), generation)

    def remember(self, row: Model) -> None:
        self.known[(type(row), row.id)] = {self.cache_name(type(row)): CachedEventRow(row, self.current_generation())}

    def remove(self, row: Model) -> None:
        self.known[(type(row), row.id)] = {self.cache_name(type(row)): CachedEventRow(None, self.current_generation())}

    def cache_name(self, model: type[Model]) -> str:
        query = self.queries.query(model)
        return f"listeners.event_row:{self.queries.database.read_actor_id}:{query.scoped(query.select).conditions}"
