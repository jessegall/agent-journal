from core.base.change.moved import Moved
from engine.command.context import Context
from core.base.listener.save_listener import SaveListener
from engine.repository.repository import Repository
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_block_renewal import TaskBlockRenewal


class TaskBlockRenewalListener(SaveListener[Moved[Task]]):
    """Records every written block reason in the transaction that blocks the task."""

    name = "tasks.block-renewal"
    moves = tuple([TaskLifecycle.block])

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, event: Moved[Task], context: Context) -> None:
        task = event.row
        self.repository.save(TaskBlockRenewal(task_id=task.id, creator_id=context.actor.id,
                                              task_version=task.version, reason=task.reason), context)
