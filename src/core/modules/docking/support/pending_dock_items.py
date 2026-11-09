from core.base.database.kept_rows import KeptRows
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.models.enums.dock_item_state import DockItemState
from core.modules.docking.queries.dock_item_query import DockItemQuery

WAITING_CONDITION = "state = ? AND kept = ? AND leaves_at IS NULL"
WAITING_PARAMETERS = (DockItemState.DOCKED.value, False)


class PendingDockItems:
    """Shares the docked items that still need a departure time."""

    def __init__(self, items: DockItemQuery, kept: KeptRows) -> None:
        self.items, self.kept = items, kept

    def matching(self, model_name: str, row_id: int) -> list[DockItem]:
        items = self.kept.read("dock_items", lambda: tuple(self.items.waiting().all_rows()), WAITING_CONDITION, WAITING_PARAMETERS, name="docking.pending_items")
        return [item for item in items if item.target_model == model_name and item.target_id == row_id]

    def remove(self, scheduled: DockItem) -> None:
        def without_scheduled(items: tuple[DockItem, ...]) -> tuple[DockItem, ...]:
            return tuple(item for item in items if item.id != scheduled.id)

        self.kept.update("dock_items", without_scheduled, WAITING_CONDITION, WAITING_PARAMETERS, name="docking.pending_items")

    def remember(self, saved: DockItem) -> None:
        def with_saved(items: tuple[DockItem, ...]) -> tuple[DockItem, ...]:
            others = tuple(item for item in items if item.id != saved.id)
            return (*others, saved) if saved.state is DockItemState.DOCKED and not saved.kept and saved.leaves_at is None else others

        self.kept.update("dock_items", with_saved, WAITING_CONDITION, WAITING_PARAMETERS, name="docking.pending_items")
