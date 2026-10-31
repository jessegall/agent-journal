from core.base.change.change import Change
from core.base.command.bus import Bus
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.plans.plan_task import PlanTask
from core.modules.tasks.commands import TaskCancel


class CancelOpenPlanTasks(SaveListener):
    """A cancelled plan leaves no open task behind: each task still open is cancelled with it, in the same
    transaction, so a refusal on any of them undoes the whole cancel."""

    name = "plans.cancel-open-plan-tasks"
    event = "plan.cancel"

    def __init__(self, bus: Bus, queries: Queries) -> None:
        self.bus, self.queries = bus, queries

    def handle(self, change: Change[Model]) -> None:
        open_places = self.queries.query(PlanTask).filter(plan_id=change.row.id).matching(IsNull("closed_at")).ordered("phase_position", "position")
        for place in tuple(open_places.all_rows()):
            self.bus.dispatch(TaskCancel(place.task_id, reason=f"plan {change.row.id} was cancelled"), change.context)
