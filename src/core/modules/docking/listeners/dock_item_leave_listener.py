from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.docking.commands.remove_dock_item.remove_dock_item import RemoveDockItem
from core.modules.docking.commands.schedule_dock_item_leave.schedule_dock_item_leave import ScheduleDockItemLeave
from core.modules.docking.listeners.environment_dock_listener import MODULE_NAME
from core.modules.docking.models.dock import Dock
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.docking.support.leave_time import LeaveTime
from core.base.change.touched import Touched
from core.base.model.model import Model


class DockItemLeaveListener(CommitListener[Touched[Model]]):
    """Whenever a change is committed, the items whose row it ended get the time they leave at, and the
    items whose time has come leave the dock, each in its own dock's environment. Time passing raises no
    event, so the next change of any kind, in any environment, is when the dock is checked."""

    name = "docking.item-leave"

    def __init__(self, bus: Bus, actors: ModuleActors, items: DockItemQuery, leave_time: LeaveTime, queries: Queries) -> None:
        self.bus, self.actors, self.items, self.leave_time, self.queries = bus, actors, items, leave_time, queries

    def handle(self, event: Touched[Model], logged: LoggedEvent) -> None:
        actor = self.actors.actor(MODULE_NAME)
        model_name = logged.event.split(".")[0]
        for item in self.pending(model_name, logged.row_id):
            leaves_at = self.leave_time.departure(item, logged.timestamp)
            if leaves_at is not None:
                self.bus.run(ScheduleDockItemLeave(item.id, leaves_at), actor, cause_id=logged.id, environment_id=self.dock_environment(item))
        for item in self.items.leaving(logged.timestamp):
            self.bus.run(RemoveDockItem(item.id), actor, cause_id=logged.id, environment_id=self.dock_environment(item))

    def dock_environment(self, item: DockItem) -> int:
        return self.queries.query(Dock).kept_find(item.dock_id).environment_id

    def pending(self, model_name: str, row_id: int) -> list[DockItem]:
        return [item for item in self.items.waiting().kept_rows() if item.target_model.replace("-", "_") == model_name and item.target_id == row_id]
