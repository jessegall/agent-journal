from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.task_brief_blocks import TaskBriefBlocks


class TaskBriefAssignedListener(SaveListener):
    """A task started for an agent blocks that agent until it read the task's brief."""

    name = "tasks.brief-assigned"
    event = "task.*"

    def __init__(self, blocks: TaskBriefBlocks) -> None:
        self.blocks = blocks

    def handle(self, change: Change[Model]) -> None:
        task = change.row
        if isinstance(task, Task) and change.move is not None and change.move.name == "start" and task.holder_id is not None and change.context.actor.type is ActorType.AGENT:
            self.blocks.block_unread(task.holder_id, task, change.context)
