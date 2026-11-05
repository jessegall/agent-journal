from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.scope.actor_scope import ActorScope
from core.base.scope.environment_scope import EnvironmentScope
from core.modules.docking.commands.make_dock.make_dock import MakeDock
from core.base.change.created import Created
from core.modules.environments.models.environment import Environment

MODULE_NAME = "journal.core.docking"


class EnvironmentDockListener(CommitListener[Created[Environment]]):
    """When an environment is made, its dock is made, as the docking module."""

    disabled_scopes = [ActorScope, EnvironmentScope]
    name = "docking.environment-dock"

    def __init__(self, bus: Bus, actors: ModuleActors) -> None:
        self.bus, self.actors = bus, actors

    def handle(self, event: Created[Environment], logged: LoggedEvent) -> None:
        self.bus.run(MakeDock(), self.actors.actor(MODULE_NAME), cause_id=logged.id, environment_id=logged.row_id)
