from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.conditions.is_null import IsNull
from core.base.query.query import Query
from core.base.timestamp import Timestamp
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.models.enums.dock_item_state import DockItemState


class DockItemQuery(Query[DockItem]):
    """Reads docked items, by dock, by type and by the row they point at."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, DockItem)

    def docked(self, dock_id: int) -> Self:
        return self.filter(dock_id=dock_id, state=DockItemState.DOCKED)

    def type_items(self, type: str) -> Self:
        return self.filter(type=type)

    def row_items(self, target_model: str, target_id: int) -> Self:
        return self.filter(target_model=target_model, target_id=target_id)

    def waiting(self) -> Self:
        return self.filter(state=DockItemState.DOCKED, kept=False).matching(IsNull("leaves_at"))

    def leaving(self, now: Timestamp) -> list[DockItem]:
        return [item for item in self.filter(state=DockItemState.DOCKED, kept=False).all_rows() if item.leaves_at is not None and item.leaves_at.value <= now.value]
