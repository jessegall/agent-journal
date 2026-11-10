from core.base.listener.save_listener import SaveListener
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from core.modules.tasks.models.task_wait import TaskWait
from core.modules.tasks.support.task_waits import TaskWaits
from suites.coding.modules.checks.models.check import Check
from engine.change.updated import Updated
from engine.command.context import Context


class TaskWaitPassListener(SaveListener[Updated[Check]]):
    """A check a task waits on that passes, or is stopped or removed, ends the wait, which opens the task when
    nothing else holds it."""

    name = "checks.task-wait-pass"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, waits: TaskWaits) -> None:
        self.queries, self.waits = queries, waits

    def handle(self, event: Updated[Check], context: Context) -> None:
        check = event.row
        if check.task_wait_id is None or not (check.last_passed is True or check.stopped or check.removed_at is not None):
            return
        wait = self.queries.query(TaskWait).find(check.task_wait_id)
        if wait.ended_at is None:
            self.waits.resolved([wait], context)
