from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.docking.commands.add_dock_item import AddDockItem
from core.modules.docking.commands.remove_dock_item import RemoveDockItem
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.dumps.models.dump import Dump
from core.modules.dumps.models.enums.dump_dock_type import DumpDockType

DUMPS_MODULE = "journal.core.dumps"


class DumpDockListener(CommitListener):
    """A dump is docked above the chat when it is made and undocked when it closes."""

    name = "dumps.dock"
    event = "dump.*"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, items: DockItemQuery) -> None:
        self.bus, self.actors, self.queries, self.items = bus, actors, queries, items

    def handle(self, event: LoggedEvent) -> None:
        dump = self.queries.query(Dump).find(event.row_id)
        actor = self.actors.actor(DUMPS_MODULE)
        if event.event == "dump.create":
            self.bus.run(AddDockItem(dump.environment_id, DumpDockType.DUMP.value, "dump", dump.id), actor, cause_id=event.id, environment_id=dump.environment_id)
        if dump.closed_at is not None:
            for item in self.items.type_items(DumpDockType.DUMP.value).row_items("dump", dump.id).all_rows():
                if item.state.value == "docked":
                    self.bus.run(RemoveDockItem(item.id), actor, cause_id=event.id, environment_id=dump.environment_id)
