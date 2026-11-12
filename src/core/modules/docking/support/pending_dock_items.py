from engine.database.kept_rows import KeptRows
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.models.enums.dock_item_state import DockItemState
from core.modules.docking.queries.dock_item_query import DockItemQuery

WAITING_REASON = "The docked items whose row has not ended; each leaves the dock once its row ends, and every change reads them from this one kept load."


class PendingDockItems:
    """Shares the docked items that still need a departure time."""

    def __init__(self, items: DockItemQuery, kept: KeptRows) -> None:
        self.items, self.kept = items, kept

    def matching(self, model_name: str, row_id: int) -> list[DockItem]:
        waiting = self.items.waiting()
        items = self.kept.read(waiting, lambda: tuple(waiting.full_table(WAITING_REASON).all_rows()), name="docking.pending_items")
        return [item for item in items if item.target_model == model_name and item.target_id == row_id]

    def remove(self, scheduled: DockItem) -> None:
        def without_scheduled(items: tuple[DockItem, ...]) -> tuple[DockItem, ...]:
            return tuple(item for item in items if item.id != scheduled.id)

        self.kept.update(self.items.waiting(), without_scheduled, name="docking.pending_items")

    def remember(self, saved: DockItem) -> None:
        def with_saved(items: tuple[DockItem, ...]) -> tuple[DockItem, ...]:
            others = tuple(item for item in items if item.id != saved.id)
            return (*others, saved) if saved.state is DockItemState.DOCKED and not saved.kept and saved.leaves_at is None else others

        self.kept.update(self.items.waiting(), with_saved, name="docking.pending_items")
