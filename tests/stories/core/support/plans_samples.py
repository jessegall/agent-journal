from core.base.change.logged_event import LoggedEvent
from engine.guard.guard import Guard
from core.base.listener.commit_listener import CommitListener
from core.base.model.model import Model
from core.base.module.module import Module
from engine.errors.refusal import Refusal
from core.modules.tasks.models.task import Task
from core.base.change.moved import Moved
from engine.command.context import Context
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle


class ProtectedTaskGuard(Guard[Moved[Task]]):
    """Refuses to cancel a task titled Keep, so a story can see a refused cancel undo the whole plan cancel."""

    name = "samples.protected-task"
    moves = tuple([TaskLifecycle.cancel])

    def check(self, event: Moved[Task], context: Context) -> None:
        if isinstance(event.old_row, Task) and event.old_row.title == "Keep":
            raise Refusal("a task titled Keep is never cancelled")


class ProtectedTasksModule(Module):
    name = "protected-tasks"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.tasks"]
    guards = [ProtectedTaskGuard]


class FailingWorkerNotice(CommitListener[Moved[Task]]):
    """Stands in for telling a worker its task was cancelled, and always fails, so a story sees the event skipped
    after three failures while the cancel stands."""

    name = "samples.failing-worker-notice"
    moves = tuple([TaskLifecycle.cancel])

    def handle(self, event: Moved[Task], logged: LoggedEvent) -> None:
        raise ConnectionError(f"the worker on task {logged.row_id} cannot be reached")


class FailingNoticeModule(Module):
    name = "failing-notice"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.tasks"]
    listeners = [FailingWorkerNotice]
