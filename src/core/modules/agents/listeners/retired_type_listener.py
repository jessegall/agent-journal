from engine.event.logged_event import LoggedEvent
from engine.event.registry_synced import RegistrySynced
from engine.command.bus import Bus
from engine.helper_type.helper_type_book import HelperTypeBook
from engine.listener.commit.commit_listener import CommitListener
from engine.module.module_actors import ModuleActors
from engine.query.conditions.among import Among
from engine.query.conditions.excluding import Excluding
from engine.query.conditions.has_value import HasValue
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from engine.scope.environment_scope import EnvironmentScope
from core.modules.agents.commands.retire_agent.retire_agent import RetireAgent
from core.modules.agents.models.agent import Agent

RETIRED_TYPE_REASON = "no installed module registers its type {role} any more"
RETIRED_TYPE_ROWS_REASON = "the ended agents whose type no module registers are retired at each sync"


class RetiredTypeListener(CommitListener[RegistrySynced]):
    """As the modules sync, an ended agent whose type no installed module registers any more is retired, keeping its
    stored type key, so nothing asks a type that is gone."""

    name = "agents.retired-type"
    disabled_scopes = [ActorScope, EnvironmentScope]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, types: HelperTypeBook) -> None:
        self.bus, self.actors, self.queries, self.types = bus, actors, queries, types

    def handle(self, event: RegistrySynced, logged: LoggedEvent) -> None:
        actor = self.actors.actor("journal.core.agents")
        agents = (self.queries.query(Agent).matching(IsNull("retired_at")).matching(HasValue("ended_at"))
                  .matching(Excluding(Among("role", list(self.types.entries)))).every_row(RETIRED_TYPE_ROWS_REASON))
        for agent in agents:
            self.bus.run(RetireAgent(agent.id, RETIRED_TYPE_REASON.format(role=agent.role)), actor, cause_id=logged.id, environment_id=agent.environment_id)
