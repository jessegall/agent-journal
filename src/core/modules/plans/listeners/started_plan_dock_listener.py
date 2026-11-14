from core.modules.plans.models.lifecycles.plan_lifecycle import PlanLifecycle
from engine.event.created import Created
from engine.event.moved import Moved
from engine.actor.actor import Actor
from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.listener.commit.commit_listener import CommitListener
from engine.module.module_actors import ModuleActors
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from core.modules.docking.commands.add_dock_item.add_dock_item import AddDockItem
from core.modules.docking.commands.remove_dock_item.remove_dock_item import RemoveDockItem
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.plans.support.plan_marks import PLANS_MODULE
from core.modules.plans.models.enums.plan_dock_type import PlanDockType
from core.modules.plans.models.plan import Plan
from engine.query.conditions.among import Among
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
        for item in items.get():
            self.bus.run(RemoveDockItem(item.id), actor, cause_id=cause_id)
