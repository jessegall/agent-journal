from engine.event.changed import Changed
from engine.event.deleted import Deleted
from engine.command.context import Context
from engine.listener.save_listener import SaveListener
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.support.pending_dock_items import PendingDockItems


class PendingDockItemsListener(SaveListener[Changed[DockItem]]):
    name = "docking.pending-items"

    def __init__(self, pending: PendingDockItems) -> None:
        self.pending = pending

    def handle(self, event: Changed[DockItem], context: Context) -> None:
        if isinstance(event, Deleted):
            self.pending.remove(event.row)
            return
        self.pending.remember(event.row)
