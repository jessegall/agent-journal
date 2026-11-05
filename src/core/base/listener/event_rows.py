from typing import TypeVar

from core.base.database.kept_rows import KeptRows
from core.base.model.model import Model
from core.base.model.tables import Tables
from core.base.query.queries import Queries

M = TypeVar("M", bound=Model)


class EventRows:
    """Shares current rows between event listeners and reloads a changed row."""

    def __init__(self, queries: Queries, tables: Tables, kept: KeptRows) -> None:
        self.queries, self.tables, self.kept = queries, tables, kept

    def find(self, model: type[M], row_id: int) -> M | None:
        return self.kept.read(self.tables.table(model).name, lambda: self.queries.query(model).filter(id=row_id).first(),
                              "id = ?", [row_id], name="listeners.event_row")
