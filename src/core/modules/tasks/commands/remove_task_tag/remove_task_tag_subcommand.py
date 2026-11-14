from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.tasks.commands.remove_task_tag.remove_task_tag import RemoveTaskTag
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery


class RemoveTaskTagSubcommand(Subcommand[RemoveTaskTag, Task]):
    """Removes one word from an existing task."""

    cli_name = "task"
    name = "untag"
    outward = True

    def __init__(self, tasks: TaskQuery) -> None:
        self.tasks = tasks

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_id", type=int)
        parser.add_argument("word")

    def command(self, arguments: Namespace, caller: Caller) -> RemoveTaskTag:
        return RemoveTaskTag(self.tasks.find(arguments.task_id), arguments.word)
