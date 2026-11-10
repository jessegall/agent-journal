from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.errors.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.scope.scopes import Scopes
from core.modules.docking.commands.add_dock_item.add_dock_item import AddDockItem
from core.modules.docking.models.dock import Dock
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.support.chat_docked_items import ChatDockedItems
from core.modules.docking.support.dock_labels import DockLabels
from core.modules.docking.support.dock_limits import MOST_ITEMS_SETTING, DockLimits
from core.modules.docking.support.leave_time import LeaveTime
from core.modules.docking.support.dock_room import DockRoom
from core.modules.docking.support.environment_docks import EnvironmentDocks


class AddDockItemHandler(Handler[AddDockItem, DockItem]):
    """Saves the item in the environment's dock, making the dock first when the environment has none. At a
    limit it undocks the oldest item that is not kept and whose row has ended, and it refuses naming the
    limit when every item is kept or still running."""

    command = AddDockItem

    def __init__(self, docks: EnvironmentDocks, repository: Repository, items: ChatDockedItems, limits: DockLimits, room: DockRoom,
                 leave_time: LeaveTime, labels: DockLabels, scopes: Scopes) -> None:
        self.docks, self.repository, self.items, self.limits, self.room, self.leave_time = docks, repository, items, limits, room, leave_time
        self.labels, self.scopes = labels, scopes

    def handle(self, command: AddDockItem, context: Context) -> DockItem:
        if context.environment_id is None:
            raise Refusal("an item is docked in an environment", "name it with --environment")
        title, text = self.labels.read(command.type, command.row_model, command.row_id)
        text = text if command.text is None else command.text
        dock = self.docks.find()
        dock = dock or self.repository.save(Dock(creator_id=context.actor.id), context)
        self.docks.remember(dock)
        chat_items = self.items.read(dock.id)
        needs_user = self.limits.requires_user(command.type)
        if not needs_user:
            type_capacity = self.limits.type_capacity(command.type)
            if type_capacity is not None:
                self.free_place([item for item in chat_items if item.type == command.type], type_capacity, f"{command.type} allows at most {type_capacity} items", context)
            dock_capacity = self.limits.dock_capacity(dock.id)
            self.free_place(self.items.read(dock.id), dock_capacity, f"the dock allows at most {dock_capacity} items", context)
        item = DockItem(dock_id=dock.id, creator_id=context.actor.id, type=command.type, target_model=command.row_model, target_id=command.row_id, title=title, text=text, kept=needs_user)
        saved = self.repository.save(item.changed(leaves_at=self.leave_time.departure(item, context.timestamp)), context)
        self.items.docked(saved)
        return saved

    def free_place(self, docked: list[DockItem], capacity: int, limit_text: str, context: Context) -> None:
        if len(docked) < capacity:
            return
        leaving = self.room.leaving(docked)
        if leaving is None:
            raise Refusal(limit_text, f"every item is pinned or still running: pin fewer, or raise {MOST_ITEMS_SETTING}")
        self.repository.save_change(leaving, leaving.undock(context.timestamp, context.actor), context)
        self.items.undocked(leaving)
