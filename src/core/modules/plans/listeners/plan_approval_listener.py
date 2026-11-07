from core.base.change.changed import Changed
from core.base.change.logged_event import LoggedEvent
from core.base.change.registry_synced import RegistrySynced
from core.base.command.bus import Bus
from core.base.command.close_user_approval import CloseUserApproval
from core.base.command.request_user_approval import RequestUserApproval
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.base.scope.environment_scope import EnvironmentScope
from core.base.user_approval import UserApproval
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.enums.plan_dock_type import PlanDockType
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.docking.commands.remove_dock_item.remove_dock_item import RemoveDockItem
from core.modules.docking.models.enums.dock_item_state import DockItemState


class PlanApprovalListener(CommitListener[Changed[Plan] | RegistrySynced]):
    """Asks for ready plans through the shared approval dock, including plans already waiting at upgrade."""

    name = "plans.approval"
    disabled_scopes = [ActorScope, EnvironmentScope]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, items: DockItemQuery) -> None:
        self.bus, self.actors, self.queries = bus, actors, queries
        self.items = items

    def handle(self, event: Changed[Plan] | RegistrySynced, logged: LoggedEvent) -> None:
        plans = tuple(self.queries.query(Plan).filter(state=PlanState.READY).all_rows()) if isinstance(event, RegistrySynced) else tuple([event.row])
        for plan in plans:
            self.update_request(plan, logged.id)

    def update_request(self, plan: Plan, cause_id: int) -> None:
        actor = self.actors.actor("journal.core.plans")
        arguments = ("plan", "approve", str(plan.id))
        if plan.state is PlanState.READY:
            approval = UserApproval(f"Approve the plan {plan.title}?\n{plan.brief}", arguments, source_version=plan.version)
            self.bus.run(RequestUserApproval(approval, arguments, plan.creator_id), actor, cause_id=cause_id, environment_id=plan.environment_id)
            waiting = tuple(self.items.type_items(PlanDockType.WAITING.value).row_items(Plan.model_name, plan.id).filter(state=DockItemState.DOCKED).all_rows())
            for item in waiting:
                self.bus.run(RemoveDockItem(item.id), actor, cause_id=cause_id, environment_id=plan.environment_id)
            return
        self.bus.run(CloseUserApproval(arguments), actor, cause_id=cause_id, environment_id=plan.environment_id)
