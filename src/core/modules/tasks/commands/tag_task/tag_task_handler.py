from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.tasks.commands.tag_task.tag_task import TagTask
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.task_tags import TaskTags


class TagTaskHandler(Handler[TagTask, Task]):
    """Adds task tags through their repository service."""

    command = TagTask

    def __init__(self, tags: TaskTags) -> None:
        self.tags = tags

    def handle(self, command: TagTask, context: Context) -> Task:
        self.tags.add(command.task, command.tags, context)
        return command.task
