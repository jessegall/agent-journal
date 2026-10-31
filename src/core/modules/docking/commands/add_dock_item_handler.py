from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.docking.commands.add_dock_item import AddDockItem
from core.modules.docking.models.dock import Dock
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.docking.support.dock_limits import MOST_ITEMS_SETTING, DockLimits
from core.modules.docking.support.leave_time import LeaveTime
from core.modules.docking.support.row_end import RowEnd


class AddDockItemHandler(Handler[AddDockItem, DockItem]):
    """Saves the item in the environment's dock, making the dock first when the environment has none. At a
    limit it undocks the oldest item that is not kept and whose row has ended, and it refuses naming the
    limit when every item is kept or still running."""

    command = AddDockItem

    def __init__(self, queries: Queries, repository: Repository, items: DockItemQuery, limits: DockLimits, row_end: RowEnd,
                 leave_time: LeaveTime) -> None:
        self.queries, self.repository, self.items, self.limits, self.row_end, self.leave_time = queries, repository, items, limits, row_end, leave_time

    def handle(self, command: AddDockItem, context: Context) -> DockItem:
        environment_id = command.environment_id or context.environment_id
        if environment_id is None:
            raise Refusal("an item is docked in an environment", "name it with --environment")
        dock = next(self.queries.query(Dock).filter(environment_id=environment_id).all_rows(), None)
        dock = dock or self.repository.save(Dock(environment_id=environment_id, creator_id=context.actor.id), context)
        type_most = self.limits.type_most(command.type)
        if type_most is not None:
            self.make_room(self.items.docked(dock.id).of_type(command.type), type_most, f"{command.type} allows at most {type_most} items", context)
        dock_most = self.limits.dock_most(dock.id)
        self.make_room(self.items.docked(dock.id), dock_most, f"the dock allows at most {dock_most} items", context)
        item = DockItem(dock_id=dock.id, creator_id=context.actor.id, type=command.type, target_model=command.row_model, target_id=command.row_id)
        return self.repository.save(item.changed(leaves_at=self.leave_time.at(item, context.timestamp)), context)

    def make_room(self, held: DockItemQuery, most: int, limit_text: str, context: Context) -> None:
        docked = list(held.oldest().all_rows())
        if len(docked) < most:
            return
        leaving = next((item for item in docked if not item.kept and self.row_end.ended(item)), None)
        if leaving is None:
            raise Refusal(limit_text, f"every item is pinned or still running: pin fewer, or raise {MOST_ITEMS_SETTING}")
        self.repository.save(leaving.undock(context.timestamp, context.actor), context)
