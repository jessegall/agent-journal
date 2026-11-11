from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.plans.support.focus.focused_plan_tasks import FocusedPlanTasks
from core.modules.plans.support.plan_task_order import PlanTaskOrder
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.tasks.support.next_task_choices import NextTaskChoices
from suites.coding.modules.workers.support.worker_open_tasks import WorkerOpenTasks


class WorkerNextTask:
    """The task a worker takes next of those it may start: open, waiting on nothing and behind no checkpoint
    that has not passed. The plan's order is a suggestion: the first by priority and place in the plan goes
    first, whatever phase the plan is at. A task the worker was told to take next goes before that, then the
    next task of the worker's plan focus. The focus only changes the order: a worker with nothing to take in
    its focus takes its other tasks."""

    def __init__(self, tasks: TaskQuery, plan_order: PlanTaskOrder, choices: NextTaskChoices, focused: FocusedPlanTasks, queries: Queries, open_tasks: WorkerOpenTasks) -> None:
        self.tasks, self.plan_order, self.choices, self.focused, self.queries, self.open_tasks = tasks, plan_order, choices, focused, queries, open_tasks

    def following(self, worker_id: int) -> Task | None:
        return self.first_ready(worker_id, tuple(self.tasks.assigned_ready(worker_id)), tuple(self.tasks.started_tasks(worker_id)))

    def first_ready(self, worker_id: int, ready: tuple[Task, ...], started: tuple[Task, ...]) -> Task | None:
        startable = self.open_tasks.startable_tasks(worker_id, ready, len(started))
        return self.choices.find(worker_id) or self.focus_task(worker_id, startable) or self.plan_order.first_placed(startable)

    def focus_task(self, worker_id: int, ready: tuple[Task, ...]) -> Task | None:
        if len(ready) < 2:
            return None
        focused = self.focused.first(self.queries.query(Agent).find(worker_id))
        return next((task for task in ready if focused is not None and task.id == focused.id), None)
