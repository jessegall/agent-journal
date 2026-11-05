from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.scope.scopes import Scopes
from core.modules.docking.commands.add_dock_item.add_dock_item import AddDockItem
from core.modules.docking.models.dock import Dock
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.docking.support.dock_labels import DockLabels
from core.modules.docking.support.dock_limits import MOST_ITEMS_SETTING, DockLimits
from core.modules.docking.support.leave_time import LeaveTime
from core.modules.docking.support.row_end import RowEnd


class AddDockItemHandler(Handler[AddDockItem, DockItem]):
    """Saves the item in the environment's dock, making the dock first when the environment has none. At a
    limit it undocks the oldest item that is not kept and whose row has ended, and it refuses naming the
    limit when every item is kept or still running."""

    command = AddDockItem

    def __init__(self, queries: Queries, repository: Repository, items: DockItemQuery, limits: DockLimits, row_end: RowEnd,
                 leave_time: LeaveTime, labels: DockLabels, scopes: Scopes) -> None:
        self.queries, self.repository, self.items, self.limits, self.row_end, self.leave_time = queries, repository, items, limits, row_end, leave_time
        self.labels, self.scopes = labels, scopes

    def handle(self, command: AddDockItem, context: Context) -> DockItem:
        environment_id = command.environment_id or context.environment_id
        if environment_id is None:
            raise Refusal("an item is docked in an environment", "name it with --environment")
        title, text = self.labels.read(command.type, command.row_model, command.row_id)
        dock = self.queries.query(Dock).first()
        dock = dock or self.repository.save(Dock(creator_id=context.actor.id), context)
        chat_items = self.items.docked(dock.id).same_chat(self.scopes.actor_id)
        type_capacity = self.limits.type_capacity(command.type)
        if type_capacity is not None:
            self.free_place(chat_items.type_items(command.type), type_capacity, f"{command.type} allows at most {type_capacity} items", context)
        dock_capacity = self.limits.dock_capacity(dock.id)
        self.free_place(chat_items, dock_capacity, f"the dock allows at most {dock_capacity} items", context)
        item = DockItem(dock_id=dock.id, creator_id=context.actor.id, type=command.type, target_model=command.row_model, target_id=command.row_id, title=title, text=text)
        return self.repository.save(item.changed(leaves_at=self.leave_time.departure(item, context.timestamp)), context)

    def free_place(self, docked_items: DockItemQuery, capacity: int, limit_text: str, context: Context) -> None:
        docked = list(docked_items.oldest().all_rows())
        if len(docked) < capacity:
            return
        leaving = next((item for item in docked if not item.kept and self.row_end.ended(item)), None) or next((item for item in docked if not item.kept and not self.leave_time.is_running(item)), None)
        if leaving is None:
            raise Refusal(limit_text, f"every item is pinned or still running: pin fewer, or raise {MOST_ITEMS_SETTING}")
        self.repository.save_change(leaving, leaving.undock(context.timestamp, context.actor), context)
