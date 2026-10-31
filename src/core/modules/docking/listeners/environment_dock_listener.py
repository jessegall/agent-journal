from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.modules.docking.commands.make_dock import MakeDock

MODULE_NAME = "journal.core.docking"


class EnvironmentDockListener(CommitListener):
    """When an environment is made, its dock is made, as the docking module."""

    name = "docking.environment-dock"
    event = "environment.create"

    def __init__(self, bus: Bus, actors: ModuleActors) -> None:
        self.bus, self.actors = bus, actors

    def handle(self, event: LoggedEvent) -> None:
        self.bus.run(MakeDock(event.row_id), self.actors.actor(MODULE_NAME), cause_id=event.id, environment_id=event.row_id)
