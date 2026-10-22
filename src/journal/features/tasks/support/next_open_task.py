from journal.models.open_task import OpenTask
from journal.models.plan import Plan
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.plans import Plans
from journal.repositories.tasks import Tasks


class NextOpenTask:
    """What a task's close leaves open next, closed by command or by a commit: the task the plan it moves took in hand at the close or that plan's next open task, else the first free open task; nothing when the plan keeps an older task in hand, the closer has another task in hand or a task is parked."""

    def __init__(self, tasks: Tasks, plans: Plans) -> None:
        self.tasks, self.plans = tasks, plans

    def following(self, closed: Task) -> OpenTask | None:
        started_plans = self.plans.started_plans(closed)
        if started_plans:
            return self.plan_next(started_plans[0], closed)
        holder = self.tasks.holder(closed)
        if (holder is not None and self.tasks.holder_task(holder) is not None) or self.tasks.with_state(TaskState.SUSPENDED):
            return None
        free = self.plans.free()
        return OpenTask(free[0].row_id, free[0].title, free[0].brief, 0) if free else None

    def is_planned(self, closed: Task) -> bool:
        return bool(self.plans.started_plans(closed))

    def plan_next(self, plan: Plan, closed: Task) -> OpenTask | None:
        current = self.plans.started_task(plan)
        if current is not None and current.started_at is not None and closed.finished_at is not None and current.started_at < closed.finished_at:
            return None
        task = current or self.plans.next_task(plan)
        return OpenTask(task.row_id, task.title, task.brief, plan.row_id) if task else None
