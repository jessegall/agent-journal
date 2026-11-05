from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.docking.commands.add_dock_item.add_dock_item import AddDockItem
from core.modules.docking.commands.remove_dock_item.remove_dock_item import RemoveDockItem
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.docking.models.dock import Dock
from core.modules.docking.models.enums.dock_item_state import DockItemState
from core.modules.dumps.models.dump import Dump
from core.modules.dumps.models.enums.dump_dock_type import DumpDockType
from core.base.change.changed import Changed
from core.base.change.created import Created

DUMPS_MODULE = "journal.core.dumps"


class DumpDockListener(CommitListener[Changed[Dump]]):
    """A dump is docked above the chat when it is made and undocked when it closes."""

    name = "dumps.dock"
    disabled_scopes = [ActorScope]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, items: DockItemQuery) -> None:
        self.bus, self.actors, self.queries, self.items = bus, actors, queries, items

    def handle(self, event: Changed[Dump], logged: LoggedEvent) -> None:
        dump = event.row
        actor = self.actors.actor(DUMPS_MODULE)
        if isinstance(event, Created):
            docks = self.queries.query(Dock)
            if logged.environment_id is not None:
                docks = docks.filter(environment_id=logged.environment_id)
            for dock in docks.all_rows():
                self.bus.run(AddDockItem(dock.environment_id, DumpDockType.DUMP.value, "dump", dump.id), actor, cause_id=logged.id, environment_id=dock.environment_id)
        if dump.closed_at is not None:
            for item in self.items.type_items(DumpDockType.DUMP.value).row_items("dump", dump.id).all_rows():
                if item.state != DockItemState.DOCKED:
                    continue
                dock = self.queries.query(Dock).find(item.dock_id)
                self.bus.run(RemoveDockItem(item.id), actor, cause_id=logged.id, environment_id=dock.environment_id)
