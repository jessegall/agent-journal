from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.docking.guards.support.docking_arrival import DockingArrival
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
        matching = self.items.docked(item.dock_id).type_items(item.type).row_items(item.target_model, item.target_id)
        if any(sibling.id != item.id for sibling in matching.all_rows()):
            raise Refusal(f"{item.target_model} {item.target_id} is docked already as {item.type}", "it is docked once for each type")
