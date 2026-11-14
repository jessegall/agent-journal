from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.tasks.commands.remove_task_tag.remove_task_tag import RemoveTaskTag
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.task_tags import TaskTags


class RemoveTaskTagHandler(Handler[RemoveTaskTag, Task]):
    """Removes a task tag through its repository service."""

    command = RemoveTaskTag

    def __init__(self, tags: TaskTags) -> None:
        self.tags = tags

    def handle(self, command: RemoveTaskTag, context: Context) -> Task:
        self.tags.remove(command.task, command.word, context)
        return command.task
