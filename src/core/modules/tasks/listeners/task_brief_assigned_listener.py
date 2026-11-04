from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.task_brief_blocks import TaskBriefBlocks


class TaskBriefAssignedListener(SaveListener):
    """A task started for an agent blocks that agent until it read the task's brief, and so does the earlier
    task it goes back to when another one leaves its hands."""

    name = "tasks.brief-assigned"
    event = "task.*"

    def __init__(self, blocks: TaskBriefBlocks) -> None:
        self.blocks = blocks

    def handle(self, change: Change[Model]) -> None:
        task = change.row
        if not isinstance(task, Task):
            return
        if self.is_agent_start(change) and task.holder_id is not None:
            self.blocks.block_unread(task.holder_id, task, change.context)
        previous = change.old_row
        if isinstance(previous, Task) and self.left_its_holder(previous, task):
            self.blocks.block_current(previous.holder_id, change.context)

    @staticmethod
    def left_its_holder(previous: Task, task: Task) -> bool:
        return previous.holder_id is not None and previous.state is TaskState.STARTED and task.state is not TaskState.STARTED

    @staticmethod
    def is_agent_start(change: Change[Model]) -> bool:
        return change.move is not None and change.move.name == "start" and change.context.actor.type is ActorType.AGENT
