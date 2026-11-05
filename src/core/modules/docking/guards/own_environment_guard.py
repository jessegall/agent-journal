from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.docking.models.dock import Dock
from core.modules.docking.models.dock_item import DockItem
from core.base.change.changed import Changed
from core.base.command.context import Context


class OwnEnvironmentGuard(Guard[Changed[DockItem]]):
    """An item belongs to its environment's dock, and no other environment adds to it, keeps it or undocks it.
    """

    name = "docking.own-environment"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, event: Changed[DockItem], context: Context) -> None:
        item, environment_id = event.row, context.environment_id
        if not isinstance(item, DockItem) or environment_id is None:
            return
        if self.queries.query(Dock).find(item.dock_id).environment_id != environment_id:
            raise Refusal(f"dock item {item.id} belongs to another environment's dock", "name its own environment with --environment")
