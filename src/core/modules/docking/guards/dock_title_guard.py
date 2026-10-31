from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.docking.guards.support.docking_arrival import DockingArrival


class DockTitleGuard(Guard):
    """An item arrives with a title: a card with none is a fault in its type's declaration, which is refused here
    and fixed there."""

    name = "docking.item-title"
    event = "dock_item.*"

    def check(self, change: Change[Model]) -> None:
        item = DockingArrival.item(change)
        if item is not None and not item.title:
            raise Refusal(f"an item of the dock type {item.type} has no title: the row {item.target_model} {item.target_id} has no field to make one from",
                          "change the dock type's title to use a field the row has")
