from core.base.change.change import Change
from core.base.command.bus import Bus
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.plans.plan_tasks import PlanTasks
from core.tasks.commands import TaskCancel


class CancelOpenPlanTasks(SaveListener):
    """A cancelled plan leaves no open task behind: each task still open is cancelled with it, in the same
    transaction, so a refusal on any of them undoes the whole cancel."""

    name = "plans.cancel-open-plan-tasks"
    event = "plan.cancel"

    def __init__(self, bus: Bus, plan_tasks: PlanTasks) -> None:
        self.bus, self.plan_tasks = bus, plan_tasks

    def handle(self, change: Change[Model]) -> None:
        for task in self.plan_tasks.ordered(change.row.id):
            if task.closed_at is None:
                self.bus.dispatch(TaskCancel(task.id, reason=f"plan {change.row.id} was cancelled"), change.context)
