from engine.guard.guard import Guard
from engine.listener.event_rows import EventRows
from engine.errors.refusal import Refusal
from core.modules.docking.models.dock import Dock
from core.modules.docking.models.dock_item import DockItem
from engine.event.changed import Changed
from engine.command.context import Context


class OwnEnvironmentGuard(Guard[Changed[DockItem]]):
    """An item belongs to its environment's dock, and no other environment adds to it, keeps it or undocks it.
    """

    name = "docking.own-environment"

    def __init__(self, rows: EventRows) -> None:
        self.rows = rows

    def check(self, event: Changed[DockItem], context: Context) -> None:
        item = event.row
        if self.rows.find(Dock, item.dock_id) is None:
            raise Refusal(f"dock item {item.id} belongs to another environment's dock", "name its own environment with --environment")
