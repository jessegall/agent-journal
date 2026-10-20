from journal.models.open_task import OpenTask
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.plans import Plans
from journal.repositories.tasks import Tasks


class AfterAClose:
    """What a task's close leaves open next, closed by command or by a commit: the first free open task; nothing while a task is in hand, the closed one's plan moves on, or a task is parked."""

    def __init__(self, tasks: Tasks, plans: Plans) -> None:
        self.tasks, self.plans = tasks, plans

    def next_open(self, done: Task) -> OpenTask | None:
        if self.tasks.in_hand() is not None or self.plans.is_moving(done):
            return None
        if self.tasks.in_state(TaskState.PARKED):
            return None
        open_ = self.plans.free()
        return OpenTask(open_[0].id, open_[0].title) if open_ else None
