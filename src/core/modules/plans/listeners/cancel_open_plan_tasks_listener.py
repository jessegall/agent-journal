from engine.command.bus import Bus
from engine.listener.save_listener import SaveListener
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.modules.plans.models.plan_task import PlanTask
from core.modules.tasks.commands.cancel_task.cancel_task import CancelTask
from engine.event.moved import Moved
from engine.command.context import Context
from core.modules.plans.models.lifecycles.plan_lifecycle import PlanLifecycle
from core.modules.plans.models.plan import Plan


class CancelOpenPlanTasksListener(SaveListener[Moved[Plan]]):
    """A cancelled plan leaves no open task behind: each task still open is cancelled with it, in the same
    transaction, so a refusal on any of them undoes the whole cancel."""

    name = "plans.cancel-open-plan-tasks"
    moves = tuple([PlanLifecycle.cancel])

    def __init__(self, bus: Bus, queries: Queries) -> None:
        self.bus, self.queries = bus, queries

    def handle(self, event: Moved[Plan], context: Context) -> None:
        open_places = self.queries.query(PlanTask).filter(plan_id=event.row.id).matching(IsNull("closed_at")).ordered("phase_position", "position")
        for place in tuple(open_places.all_rows()):
            self.bus.dispatch(CancelTask(place.task_id, reason=f"plan {event.row.id} was cancelled"), context)
