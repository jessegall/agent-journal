from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.plans import Plans
from journal.repositories.tasks import Tasks
from journal.support.said import Said


class AfterAClose:
    """What a task's close says comes next, closed by command or by a commit: a parked task first, else the next open one; nothing while a task is in hand or the closed one's plan moves on."""

    def __init__(self, tasks: Tasks, plans: Plans) -> None:
        self.tasks, self.plans = tasks, plans

    def said(self, done: Task) -> Said | None:
        from journal.features.tasks.feature import Tasks as TasksFeature
        if self.tasks.in_hand() is not None or self.plans.is_moving(done):
            return None
        parked = self.tasks.in_state(TaskState.PARKED)
        if parked:
            return TasksFeature.PARKED_STILL.about(n=parked[0].id, why=parked[0].parked_why)
        open_ = self.plans.free()
        return TasksFeature.NEXT.about(n=open_[0].id, title=open_[0].title) if open_ else None
