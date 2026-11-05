from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.base.actor_type import ActorType
from core.base.listener.save_listener import SaveListener
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.task_brief_blocks import TaskBriefBlocks
from core.base.change.changed import Changed
from core.base.command.context import Context


class TaskBriefAssignedListener(SaveListener[Changed[Task]]):
    """A task started for an agent blocks that agent until it read the task's brief, and so does the earlier
    task it goes back to when another one leaves its hands."""

    name = "tasks.brief-assigned"

    def __init__(self, blocks: TaskBriefBlocks) -> None:
        self.blocks = blocks

    def handle(self, event: Changed[Task], context: Context) -> None:
        task = event.row
        if self.is_agent_start(event, context) and task.holder_id is not None:
            self.blocks.block_unread(task.holder_id, task, context)
        previous = event.old_row
        if previous is not None and self.holder_changed(previous, task):
            self.blocks.block_current(previous.holder_id, context)

    @staticmethod
    def holder_changed(previous: Task, task: Task) -> bool:
        return previous.holder_id is not None and previous.state is TaskState.STARTED and task.state is not TaskState.STARTED

    @staticmethod
    def is_agent_start(event: Changed[Task], context: Context) -> bool:
        return event.move is TaskLifecycle.start and context.actor.type is ActorType.AGENT
