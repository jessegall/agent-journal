from engine.command.bus import Bus
from engine.command.context import Context
from core.modules.plans.support.next_plan_tasks import NextPlanTasks
from core.modules.tasks.commands.assign_task.assign_task import AssignTask
from core.modules.tasks.queries.task_query import TaskQuery

WORKER_MOST_COMPLEXITY = 3


class WorkerFreeTask:
    """Gives a worker the most urgent free task outside any plan that is simple enough for a worker."""

    def __init__(self, tasks: TaskQuery, plan_tasks: NextPlanTasks, bus: Bus) -> None:
        self.tasks, self.plan_tasks, self.bus = tasks, plan_tasks, bus

    def give_next(self, worker_id: int, context: Context) -> None:
        task = self.tasks.next_simple(WORKER_MOST_COMPLEXITY, self.plan_tasks.plan_exclusion())
        if task is not None:
            self.bus.dispatch(AssignTask(task.id, worker_id), context)
