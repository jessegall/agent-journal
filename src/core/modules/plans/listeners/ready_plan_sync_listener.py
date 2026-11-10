from engine.change.logged_event import LoggedEvent
from engine.change.registry_synced import RegistrySynced
from engine.command.bus import Bus
from engine.command.close_user_approval import CloseUserApproval
from engine.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from engine.scope.environment_scope import EnvironmentScope
from core.modules.docking.commands.add_dock_item.add_dock_item import AddDockItem
from core.modules.docking.models.enums.dock_item_state import DockItemState
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.plans.models.enums.plan_dock_type import PlanDockType
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan


class ReadyPlanSyncListener(CommitListener[RegistrySynced]):
    """As the modules sync, a plan already waiting for approval gets its own plan card, and the approval an older
    version asked for it is closed: a person approves a ready plan on its card, with no approval of its own."""

    name = "plans.ready-sync"
    disabled_scopes = [ActorScope, EnvironmentScope]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, items: DockItemQuery) -> None:
        self.bus, self.actors, self.queries, self.items = bus, actors, queries, items

    def handle(self, event: RegistrySynced, logged: LoggedEvent) -> None:
        actor = self.actors.actor("journal.core.plans")
        for plan in self.queries.query(Plan).filter(state=PlanState.READY).all_rows():
            self.bus.run(CloseUserApproval(("plan", "approve", str(plan.id))), actor, cause_id=logged.id, environment_id=plan.environment_id)
            if not self.items.type_items(PlanDockType.WAITING.value).row_items(Plan.model_name, plan.id).filter(state=DockItemState.DOCKED).all_rows():
                self.bus.run(AddDockItem(PlanDockType.WAITING.value, Plan.model_name, plan.id), actor, cause_id=logged.id, environment_id=plan.environment_id)
