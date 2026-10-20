from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.plans import Plans
from journal.repositories.tasks import Tasks
from journal.engine.nudge import Nudge


class AfterAClose:
    """What a task's close says comes next, closed by command or by a commit: the next open one; nothing while a task is in hand, the closed one's plan moves on, or a task is parked, which the workflow Name a parked task when a task closes names."""

    def __init__(self, tasks: Tasks, plans: Plans) -> None:
        self.tasks, self.plans = tasks, plans

    def said(self, done: Task) -> Nudge | None:
        from journal.features.tasks.feature import Tasks as TasksFeature
        if self.tasks.in_hand() is not None or self.plans.is_moving(done):
            return None
        if self.tasks.in_state(TaskState.PARKED):
            return None
        open_ = self.plans.free()
        return TasksFeature.NEXT.create(n=open_[0].id, title=open_[0].title) if open_ else None
