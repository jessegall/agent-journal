from engine.guard.guard import Guard
from engine.command.completed_command_error import CompletedCommandError
from core.modules.docking.guards.support.docking_arrival import DockingArrival
from core.modules.docking.queries.dock_item_query import DockItemQuery
from engine.change.changed import Changed
from engine.command.context import Context
from core.modules.docking.models.dock_item import DockItem


class OneItemPerRowGuard(Guard[Changed[DockItem]]):
    """A row is docked once per type."""

    name = "docking.one-per-row"

    def __init__(self, items: DockItemQuery) -> None:
        self.items = items

    def check(self, event: Changed[DockItem], context: Context) -> None:
        item = DockingArrival.item(event)
        if item is None:
            return
        matching = self.items.docked(item.dock_id).type_items(item.type).row_items(item.target_model, item.target_id)
        if any(sibling.id != item.id for sibling in matching.all_rows()):
            raise CompletedCommandError(f"{item.target_model} {item.target_id} is docked already as {item.type}", "it is docked once for each type")
