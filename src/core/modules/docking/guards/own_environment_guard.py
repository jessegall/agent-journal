from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.docking.models.dock import Dock
from core.modules.docking.models.dock_item import DockItem


class OwnEnvironmentGuard(Guard):
    """An item belongs to its environment's dock, and no other environment adds to it, keeps it or undocks it."""

    name = "docking.own-environment"
    event = "dock_item.*"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, change: Change[Model]) -> None:
        item, environment_id = change.row, change.context.environment_id
        if not isinstance(item, DockItem) or environment_id is None:
            return
        if self.queries.query(Dock).find(item.dock_id).environment_id != environment_id:
            raise Refusal(f"dock item {item.id} belongs to another environment's dock", "name its own environment with --environment")
