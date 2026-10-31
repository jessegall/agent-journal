from core.base.change.change import Change
from core.base.change.logged_event import LoggedEvent
from core.base.guard.guard import Guard
from core.base.listener.commit_listener import CommitListener
from core.base.model.model import Model
from core.base.module.module import Module
from core.base.refusal import Refusal
from core.modules.tasks.task import Task


class ProtectedTaskGuard(Guard):
    """Refuses to cancel a task titled Keep, so a story can see a refused cancel undo the whole plan cancel."""

    name = "samples.protected-task"
    event = "task.cancel"

    def check(self, change: Change[Model]) -> None:
        if isinstance(change.old_row, Task) and change.old_row.title == "Keep":
            raise Refusal("a task titled Keep is never cancelled")


class ProtectedTasksModule(Module):
    name = "protected-tasks"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.tasks"]
    guards = [ProtectedTaskGuard]


class FailingWorkerNotice(CommitListener):
    """Stands in for telling a worker its task was cancelled, and always fails, so a story sees the event skipped
    after three failures while the cancel stands."""

    name = "samples.failing-worker-notice"
    event = "task.cancel"

    def handle(self, event: LoggedEvent) -> None:
        raise ConnectionError(f"the worker on task {event.row_id} cannot be reached")


class FailingNoticeModule(Module):
    name = "failing-notice"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.tasks"]
    listeners = [FailingWorkerNotice]
