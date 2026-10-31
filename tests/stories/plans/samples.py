from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.module.module import Module
from core.base.refusal import Refusal
from core.tasks.task import Task


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
    dependencies = ("tasks",)
    guards = ("tests.stories.plans.samples:ProtectedTaskGuard",)
