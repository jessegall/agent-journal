from engine.event.changed import Changed
from engine.event.deleted import Deleted
from engine.command.context import Context
from engine.listener.save_listener import SaveListener
from core.modules.plans.models.phase_task import PhaseTask
from core.modules.plans.support.task_plans import TaskPlans


class TaskPlanRowsListener(SaveListener[Changed[PhaseTask]]):
    name = "plans.task-phase-rows"

    def __init__(self, plans: TaskPlans) -> None:
        self.plans = plans

    def handle(self, event: Changed[PhaseTask], context: Context) -> None:
        if event.old_row is not None:
            self.plans.remove(event.old_row)
        if isinstance(event, Deleted):
            self.plans.remove(event.row)
            return
        self.plans.remember(event.row)
