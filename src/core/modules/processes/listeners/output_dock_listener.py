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
from core.modules.processes.support.shown_runs import ShownRuns


class OutputDockListener(CommitListener):
    """A watch of a running output docks it above the chat, once; the dock lets it leave after its run ends. A
    command that only reads or writes files is never docked, nor is a worker's own command but its test runs."""

    name = "processes.output-dock"
    event = "watch.create"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, items: DockItemQuery, shown_runs: ShownRuns) -> None:
        self.bus, self.actors, self.queries, self.items, self.shown_runs = bus, actors, queries, items, shown_runs

    def handle(self, event: LoggedEvent) -> None:
        process = self.queries.query(Process).find(self.queries.query(Watch).find(event.row_id).process_id)
        if process.state not in RUNNING_STATES or self.shown_runs.hides(process) or self.items.type_items(ProcessDockType.OUTPUT.value).row_items("process", process.id).exists():
            return
        self.bus.run(AddDockItem(process.environment_id, ProcessDockType.OUTPUT.value, "process", process.id), self.actors.actor(MODULE_NAME), cause_id=event.id,
                     environment_id=process.environment_id)
