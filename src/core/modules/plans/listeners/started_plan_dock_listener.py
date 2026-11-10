from core.modules.plans.models.lifecycles.plan_lifecycle import PlanLifecycle
from core.base.change.created import Created
from core.base.change.moved import Moved
from engine.actor.actor import Actor
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.docking.commands.add_dock_item.add_dock_item import AddDockItem
from core.modules.docking.commands.remove_dock_item.remove_dock_item import RemoveDockItem
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.plans.listeners.plan_move_mark_listener import PLANS_MODULE
from core.modules.plans.models.enums.plan_dock_type import PlanDockType
from core.modules.plans.models.plan import Plan
from core.base.query.conditions.among import Among
from core.modules.docking.models.enums.dock_item_state import DockItemState

ENDING_MOVES = ("close", "cancel")
DOCKING_MOVES = {"create": PlanDockType.DRAFT, "ready": PlanDockType.WAITING, "start": PlanDockType.STARTED, "unblock": PlanDockType.STARTED, "block": PlanDockType.PAUSED}


class StartedPlanDockListener(CommitListener[Created[Plan] | Moved[Plan]]):
    """A plan is docked above the chat as it stands: a draft once made, waiting for the user once
    ready, started, paused; it is undocked when approved or ended."""

    name = "plans.started-dock"
    moves = (PlanLifecycle.approve, PlanLifecycle.close, PlanLifecycle.cancel, PlanLifecycle.ready, PlanLifecycle.start, PlanLifecycle.unblock, PlanLifecycle.block)
    disabled_scopes = [ActorScope]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, items: DockItemQuery) -> None:
        self.bus, self.actors, self.queries, self.items = bus, actors, queries, items

    def handle(self, event: Created[Plan] | Moved[Plan], logged: LoggedEvent) -> None:
        move = event.move.name if event.move else "create"
        plan = event.row
        actor = self.actors.actor(PLANS_MODULE)
        if move in ENDING_MOVES or move in ("approve", "ready"):
            self.undock(plan, actor, logged.id)
        if move in DOCKING_MOVES:
            self.undock(plan, actor, logged.id)
            self.bus.run(AddDockItem(DOCKING_MOVES[move].value, Plan.model_name, plan.id), actor, cause_id=logged.id)

    def undock(self, plan: Plan, actor: Actor, cause_id: int) -> None:
        items = self.items.row_items("plan", plan.id).filter(state=DockItemState.DOCKED).matching(Among("type", tuple(dock_type.value for dock_type in PlanDockType)))
        for item in items.all_rows():
            self.bus.run(RemoveDockItem(item.id), actor, cause_id=cause_id)
