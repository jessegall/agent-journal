from typing import TypeVar

from core.base.database.kept_rows import KeptRows
from core.base.model.model import Model
from core.base.model.tables import Tables
from core.base.missing_rows_error import MissingRowsError
from core.base.query.queries import Queries

M = TypeVar("M", bound=Model)


class EventRows:
    """Shares current rows between event listeners and reloads a changed row."""

    def __init__(self, queries: Queries, tables: Tables, kept: KeptRows) -> None:
        self.queries, self.tables, self.kept = queries, tables, kept

    def find(self, model: type[M], row_id: int) -> M | None:
        return self.kept.read(self.tables.table(model).name, lambda: self.queries.query(model).filter(id=row_id).first(),
                              "id = ?", [row_id], name="listeners.event_row")

    def required(self, model: type[M], row_id: int) -> M:
        row = self.find(model, row_id)
        if row is None:
            raise MissingRowsError(model.cli_name, [row_id])
        return row

    def remember(self, row: Model) -> None:
        self.kept.update(self.tables.table(type(row)).name, lambda previous: row,
                          "id = ?", [row.id], name="listeners.event_row")

    def remove(self, row: Model) -> None:
        self.kept.update(self.tables.table(type(row)).name, lambda previous: None,
                          "id = ?", [row.id], name="listeners.event_row")
