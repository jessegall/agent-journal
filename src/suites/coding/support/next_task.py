from core.base.query.queries import Queries
from core.modules.plans.support.next_plan_tasks import NextPlanTasks
from core.modules.tasks.models.support.task_priority import URGENT_PRIORITY
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery


class NextTask:
    """The task an agent with empty hands is given: a task above high outside any plan, else a
    started plan's next task, else the most urgent open task outside any plan that waits on nothing.
    An agent with tasks still in hand is given only the task above high."""

    def __init__(self, tasks: TaskQuery, plan_tasks: NextPlanTasks, queries: Queries) -> None:
        self.tasks, self.plan_tasks, self.queries = tasks, plan_tasks, queries

    def urgent(self, environment_id: int, excluded_id: int | None = None) -> Task | None:
        most_urgent = self.tasks.next_open(environment_id, excluded_id, self.plan_tasks.plan_exclusion())
        return most_urgent if most_urgent is not None and most_urgent.priority >= URGENT_PRIORITY else None

    def following(self, environment_id: int, excluded_id: int | None = None) -> Task | None:
        urgent = self.urgent(environment_id, excluded_id)
        if urgent is not None:
            return urgent
        planned = self.plan_tasks.environment_task(environment_id)
        if planned is not None and planned.id != excluded_id:
            return planned
        return self.tasks.next_open(environment_id, excluded_id, self.plan_tasks.plan_exclusion())
