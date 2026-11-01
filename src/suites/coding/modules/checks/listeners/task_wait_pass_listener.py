from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.modules.tasks.models.task_wait import TaskWait
from core.modules.tasks.support.task_waits import TaskWaits
from suites.coding.modules.checks.models.check import Check


class TaskWaitPassListener(SaveListener):
    """A check a task waits on that passes ends the wait, which opens the task when nothing else holds it."""

    name = "checks.task-wait-pass"
    event = "check.update"

    def __init__(self, queries: Queries, waits: TaskWaits) -> None:
        self.queries, self.waits = queries, waits

    def handle(self, change: Change[Model]) -> None:
        check = change.row
        if not isinstance(check, Check) or check.task_wait_id is None or check.last_passed is not True or check.removed_at is not None:
            return
        wait = self.queries.query(TaskWait).find(check.task_wait_id)
        if wait.ended_at is None:
            self.waits.resolved(wait, change.context)
