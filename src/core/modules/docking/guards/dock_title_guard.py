from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.docking.guards.support.docking_arrival import DockingArrival
from engine.change.changed import Changed
from engine.command.context import Context
from core.modules.docking.models.dock_item import DockItem


class DockTitleGuard(Guard[Changed[DockItem]]):
    """An item arrives with a title: a card with none is a fault in its type's declaration, which is refused
    here and fixed there."""

    name = "docking.item-title"

    def check(self, event: Changed[DockItem], context: Context) -> None:
        item = DockingArrival.item(event)
        if item is not None and not item.title:
            raise Refusal(f"an item of the dock type {item.type} has no title: the row {item.target_model} {item.target_id} has no field to make one from",
                          "change the dock type's title to use a field the row has")
