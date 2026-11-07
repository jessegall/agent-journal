from core.modules.plans.support.plan_task_order import PlanTaskOrder
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery


class WorkerNextTask:
    """The task a worker takes next of those given to it: open, waiting on nothing, and for a plan only from
    the plan's earliest phase with work left besides the worker's started task, in the plan's order."""

    def __init__(self, tasks: TaskQuery, plan_order: PlanTaskOrder) -> None:
        self.tasks, self.plan_order = tasks, plan_order

    def following(self, worker_id: int) -> Task | None:
        started_task_ids = tuple(task.id for task in self.tasks.started_tasks(worker_id))
        return self.plan_order.first(self.tasks.ready_delegated(worker_id), started_task_ids)
