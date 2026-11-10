from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.listener.commit_listener import CommitListener
from engine.module.module_actors import ModuleActors
from engine.listener.event_rows import EventRows
from engine.scope.actor_scope import ActorScope
from engine.scope.environment_scope import EnvironmentScope
from core.modules.docking.commands.schedule_dock_item_leave.schedule_dock_item_leave import ScheduleDockItemLeave
from core.modules.docking.listeners.environment_dock_listener import MODULE_NAME
from core.modules.docking.models.dock import Dock
from core.modules.docking.support.pending_dock_items import PendingDockItems
from core.modules.docking.support.leave_time import LeaveTime
from engine.event.touched import Touched
from engine.model.model import Model


class DockItemLeaveListener(CommitListener[Touched[Model]]):
    """Schedules departure for the docked items whose row ended."""

    name = "docking.item-leave"
    disabled_scopes = [ActorScope, EnvironmentScope]

    def __init__(self, bus: Bus, actors: ModuleActors, items: PendingDockItems, leave_time: LeaveTime, rows: EventRows) -> None:
        self.bus, self.actors, self.items, self.leave_time, self.rows = bus, actors, items, leave_time, rows

    def handle(self, event: Touched[Model], logged: LoggedEvent) -> None:
        actor = self.actors.actor(MODULE_NAME)
        model_name = logged.event.split(".")[0]
        items = self.items.matching(model_name.replace("_", "-"), logged.row_id)
        docks = self.rows.required_by_id(Dock, [item.dock_id for item in items])
        for item in items:
            leaves_at = self.leave_time.departure(item, logged.timestamp)
            if leaves_at is not None:
                self.bus.run(ScheduleDockItemLeave(item.id, leaves_at), actor, cause_id=logged.id, environment_id=docks[item.dock_id].environment_id)

