from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.docking.commands.add_dock_item import AddDockItem
from core.modules.docking.commands.remove_dock_item import RemoveDockItem
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.plans.listeners.plan_move_mark_listener import PLANS_MODULE
from core.modules.plans.models.enums.plan_dock_type import PlanDockType
from core.modules.plans.models.plan import Plan

ENDING_MOVES = ("close", "cancel")


class StartedPlanDockListener(CommitListener):
    """When a plan starts it is docked above the chat, and when it ends it is undocked."""

    name = "plans.started-dock"
    event = "plan.*"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, items: DockItemQuery) -> None:
        self.bus, self.actors, self.queries, self.items = bus, actors, queries, items

    def handle(self, event: LoggedEvent) -> None:
        move = event.event.split(".")[1]
        plan = self.queries.query(Plan).find(event.row_id)
        actor = self.actors.actor(PLANS_MODULE)
        if move == "start":
            self.bus.run(AddDockItem(plan.environment_id, PlanDockType.STARTED.value, "plan", plan.id), actor, cause_id=event.id, environment_id=plan.environment_id)
        if move in ENDING_MOVES:
            for item in self.items.type_items(PlanDockType.STARTED.value).row_items("plan", plan.id).all_rows():
                if item.state.value == "docked":
                    self.bus.run(RemoveDockItem(item.id), actor, cause_id=event.id, environment_id=plan.environment_id)
