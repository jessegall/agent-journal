from engine.module.model_declaration import ModelDeclaration
from core.modules.tasks.commands.block_task.block_task import BlockTask
from core.modules.tasks.commands.cancel_task.cancel_task import CancelTask
from core.modules.tasks.commands.close_task.close_task import CloseTask
from core.modules.tasks.commands.release_task.release_task import ReleaseTask
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery


class TaskModelDeclaration(ModelDeclaration):
    """How the module declares Task."""

    model = Task
    query = TaskQuery
    commands = (BlockTask, CloseTask, CancelTask, ReleaseTask)
    excluded_subcommands = ["block", "release-holder"]
