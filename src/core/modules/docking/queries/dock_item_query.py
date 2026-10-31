from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.query import Query
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.models.enums.dock_item_state import DockItemState


class DockItemQuery(Query[DockItem]):
    """Reads docked items, by dock, by type and by the row they point at."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, DockItem)

    def docked(self, dock_id: int) -> Self:
        return self.filter(dock_id=dock_id, state=DockItemState.DOCKED)

    def of_type(self, type: str) -> Self:
        return self.filter(type=type)

    def pointing_at(self, target_model: str, target_id: int) -> Self:
        return self.filter(target_model=target_model, target_id=target_id)
