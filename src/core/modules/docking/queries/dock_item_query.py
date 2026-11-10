from typing import Self

from core.base.database.database import Database
from engine.model.tables import Tables
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.has_value import HasValue
from engine.query.conditions.maximum import Maximum
from engine.query.query import Query
from engine.time.timestamp import Timestamp
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.models.enums.dock_item_state import DockItemState
from core.modules.docking.conditions.same_chat import SameChat


class DockItemQuery(Query[DockItem]):
    """Reads docked items, by dock, by type and by the row they point at."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, DockItem)

    def docked(self, dock_id: int) -> Self:
        return self.filter(dock_id=dock_id, state=DockItemState.DOCKED)

    def same_chat(self, agent_id: int | None) -> Self:
        return self.matching(SameChat(agent_id))

    def type_items(self, type: str) -> Self:
        return self.filter(type=type)

    def row_items(self, target_model: str, target_id: int) -> Self:
        return self.filter(target_model=target_model, target_id=target_id)

    def waiting(self) -> Self:
        return self.filter(state=DockItemState.DOCKED, kept=False).matching(IsNull("leaves_at"))

    def leaving(self, timestamp: Timestamp) -> list[DockItem]:
        return list(self.filter(state=DockItemState.DOCKED, kept=False).matching(HasValue("leaves_at"))
                    .matching(Maximum("leaves_at", timestamp.text)).ordered("leaves_at", "id").all_rows())
