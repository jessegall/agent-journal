from typing import TypeVar
from collections.abc import Sequence

from core.base.database.kept_rows import KeptRows
from core.base.model.model import Model
from core.base.model.tables import Tables
from core.base.missing_rows_error import MissingRowsError
from core.base.query.queries import Queries
from core.base.query.conditions.among import Among

M = TypeVar("M", bound=Model)


class EventRows:
    """Shares current rows between event listeners and reloads a changed row."""

    def __init__(self, queries: Queries, tables: Tables, kept: KeptRows) -> None:
        self.queries, self.tables, self.kept = queries, tables, kept

    def find(self, model: type[M], row_id: int) -> M | None:
        return self.kept.read(self.tables.table(model).name, lambda: self.queries.query(model).filter(id=row_id).first(),
                              "id = ?", [row_id], name=self.cache_name(model))

    def required(self, model: type[M], row_id: int) -> M:
        row = self.find(model, row_id)
        if row is None:
            raise MissingRowsError(model.cli_name, [row_id])
        return row

    def prepare(self, model: type[M], row_ids: Sequence[int]) -> None:
        loaded_rows: dict[int, M] | None = None

        def loaded(row_id: int) -> M | None:
            nonlocal loaded_rows
            if loaded_rows is None:
                loaded_rows = {row.id: row for row in self.queries.query(model).matching(Among("id", row_ids)).all_rows()}
            return loaded_rows.get(row_id)

        for row_id in dict.fromkeys(row_ids):
            self.kept.read(self.tables.table(model).name, lambda row_id=row_id: loaded(row_id),
                           "id = ?", [row_id], name=self.cache_name(model))

    def remember(self, row: Model) -> None:
        self.kept.update(self.tables.table(type(row)).name, lambda previous: row,
                          "id = ?", [row.id], name=self.cache_name(type(row)))

    def remove(self, row: Model) -> None:
        self.kept.update(self.tables.table(type(row)).name, lambda previous: None,
                          "id = ?", [row.id], name=self.cache_name(type(row)))

    def cache_name(self, model: type[Model]) -> str:
        query = self.queries.query(model)
        return f"listeners.event_row:{query.scoped(query.select).conditions}"
