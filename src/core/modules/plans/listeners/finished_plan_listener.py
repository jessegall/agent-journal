from engine.event.logged_event import LoggedEvent
from engine.event.moved import Moved
from engine.listener.commit.commit_listener import CommitListener
from core.modules.plans.listeners.support.task_plan_preparation import TaskPlanPreparation
from core.modules.plans.support.finished_plans import FinishedPlans
from core.modules.plans.support.task_plans import TaskPlans
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task


class FinishedPlanListener(TaskPlanPreparation, CommitListener[Moved[Task]]):
    """When the last open task of an approved, started or blocked plan ends, the plan is cancelled if every
    task was, and closes as completed if the checkpoint at its end has passed already."""

    name = "plans.finished-plan"
    moves = (TaskLifecycle.close, TaskLifecycle.cancel)

    def __init__(self, plans: TaskPlans, finished: FinishedPlans) -> None:
        self.plans, self.finished = plans, finished

    def handle(self, event: Moved[Task], logged: LoggedEvent) -> None:
        plan = self.plans.find(event.row.id)
        if plan is not None:
            self.finished.end(plan, logged.id)
