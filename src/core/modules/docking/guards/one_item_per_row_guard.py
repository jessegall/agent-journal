from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.docking.guards.docking_arrival import DockingArrival
from core.modules.docking.queries.dock_item_query import DockItemQuery


class OneItemPerRowGuard(Guard):
    """A row is docked once per type."""

    name = "docking.one-per-row"
    event = "dock_item.*"

    def __init__(self, items: DockItemQuery) -> None:
        self.items = items

    def check(self, change: Change[Model]) -> None:
        item = DockingArrival.item(change)
        if item is None:
            return
        same = self.items.docked(item.dock_id).of_type(item.type).pointing_at(item.target_model, item.target_id)
        if any(other.id != item.id for other in same.all_rows()):
            raise Refusal(f"{item.target_model} {item.target_id} is docked already as {item.type}", "it is docked once for each type")
