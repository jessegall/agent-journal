from engine.event.logged_event import LoggedEvent
from engine.event.registry_synced import RegistrySynced
from engine.command.bus import Bus
from engine.command.close_user_approval import CloseUserApproval
from engine.listener.commit.commit_listener import CommitListener
from engine.module.module_actors import ModuleActors
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from engine.scope.environment_scope import EnvironmentScope
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan


class ReadyPlanSyncListener(CommitListener[RegistrySynced]):
    """As the modules sync, the approval an older version asked for a ready plan is closed: a user approves
    a ready plan on its card. The card itself comes with the plan's ready move, so a card the user
    dismissed stays gone."""

    name = "plans.ready-sync"
    disabled_scopes = [ActorScope, EnvironmentScope]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries) -> None:
        self.bus, self.actors, self.queries = bus, actors, queries

    def handle(self, event: RegistrySynced, logged: LoggedEvent) -> None:
        actor = self.actors.actor("journal.core.plans")
        for plan in self.queries.query(Plan).filter(state=PlanState.READY).get():
            self.bus.run(CloseUserApproval(("plan", "approve", str(plan.id))), actor, cause_id=logged.id, environment_id=plan.environment_id)
