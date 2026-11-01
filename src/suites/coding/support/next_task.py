from core.base.query.queries import Queries
from core.modules.plans.support.next_plan_tasks import NextPlanTasks
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery


class NextTask:
    """The task an agent with empty hands is given: a started plan's next task, else the most urgent open task outside any plan that waits on nothing."""

    def __init__(self, tasks: TaskQuery, plan_tasks: NextPlanTasks, queries: Queries) -> None:
        self.tasks, self.plan_tasks, self.queries = tasks, plan_tasks, queries

    def following(self, environment_id: int, excluded_id: int | None = None) -> Task | None:
        planned = self.plan_tasks.in_environment(environment_id)
        if planned is not None and planned != excluded_id:
            return self.queries.query(Task).find(planned)
        return self.tasks.next_open(environment_id, excluded_id, self.plan_tasks.outside_plans())
