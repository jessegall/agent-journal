from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.docking.commands.add_dock_item.add_dock_item import AddDockItem
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.processes.listeners.process_end_mark_listener import MODULE_NAME
from core.modules.processes.models.enums.process_dock_type import ProcessDockType
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.process import Process
from core.modules.processes.models.watch import Watch
from core.modules.processes.support.run_visibility import RunVisibility


class OutputDockListener(CommitListener):
    """A watch of a running output docks it above the chat, once; the dock lets it leave after its run ends. A
    run that is not visible is never docked."""

    name = "processes.output-dock"
    event = "watch.create"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, items: DockItemQuery, visibility: RunVisibility) -> None:
        self.bus, self.actors, self.queries, self.items, self.visibility = bus, actors, queries, items, visibility

    def handle(self, event: LoggedEvent) -> None:
        process = self.queries.query(Process).find(self.queries.query(Watch).find(event.row_id).process_id)
        if process.state not in RUNNING_STATES or not self.visibility.is_visible(process) or self.items.type_items(ProcessDockType.OUTPUT.value).row_items("process", process.id).exists():
            return
        self.bus.run(AddDockItem(process.environment_id, ProcessDockType.OUTPUT.value, "process", process.id), self.actors.actor(MODULE_NAME), cause_id=event.id,
                     environment_id=process.environment_id)
