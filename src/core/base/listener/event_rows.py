from typing import TypeVar, cast
from collections.abc import Sequence

from core.base.model.model import Model
from core.base.database.kept_rows import KEPT_ROW_COUNT
from core.base.missing_rows_error import MissingRowsError
from core.base.query.queries import Queries
from core.base.query.conditions.among import Among

M = TypeVar("M", bound=Model)


class EventRows:
    """Shares current rows between event listeners and reloads a changed row."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries
        self.known: dict[tuple[type[Model], int], dict[str, Model | None]] = {}
        self.generation: tuple[int, int] | None = None

    def check_generation(self) -> None:
        database = self.queries.database
        generation = (database.change_mark()[0], database.write_rollback_count)
        if generation != self.generation or len(self.known) >= KEPT_ROW_COUNT:
            self.known.clear()
            self.generation = generation

    def find(self, model: type[M], row_id: int) -> M | None:
        self.check_generation()
        scopes = self.known.setdefault((model, row_id), {})
        name = self.cache_name(model)
        if name not in scopes:
            scopes[name] = self.queries.query(model).filter(id=row_id).first()
        return cast(M | None, scopes[name])

    def required(self, model: type[M], row_id: int) -> M:
        row = self.find(model, row_id)
        if row is None:
            raise MissingRowsError(model.cli_name, [row_id])
        return row

    def prepare(self, model: type[M], row_ids: Sequence[int]) -> None:
        self.check_generation()
        name = self.cache_name(model)
        missing = [row_id for row_id in dict.fromkeys(row_ids) if name not in self.known.get((model, row_id), {})]
        if not missing:
            return
        rows = {row.id: row for row in self.queries.query(model).matching(Among("id", missing)).all_rows()}
        for row_id in missing:
            self.known.setdefault((model, row_id), {})[name] = rows.get(row_id)

    def remember(self, row: Model) -> None:
        self.check_generation()
        self.known[(type(row), row.id)] = {self.cache_name(type(row)): row}

    def remove(self, row: Model) -> None:
        self.check_generation()
        self.known[(type(row), row.id)] = {self.cache_name(type(row)): None}

    def cache_name(self, model: type[Model]) -> str:
        query = self.queries.query(model)
        return f"listeners.event_row:{query.scoped(query.select).conditions}"
