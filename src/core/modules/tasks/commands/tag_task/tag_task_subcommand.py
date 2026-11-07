from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.cli.write_flags import WriteFlags
from core.base.subcommand.subcommand import Subcommand
from core.modules.tasks.commands.tag_task.tag_task import TagTask
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery


class TagTaskSubcommand(Subcommand[TagTask, Task]):
    """Adds one or more words to an existing task."""

    cli_name = "task"
    name = "tag"
    outward = True

    def __init__(self, tasks: TaskQuery, flags: WriteFlags) -> None:
        self.tasks, self.flags = tasks, flags

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_id", type=int)
        parser.add_argument("tags", nargs="+")

    def command(self, arguments: Namespace, caller: Caller) -> TagTask:
        return TagTask(self.tasks.find(arguments.task_id), tuple(arguments.tags), self.flags.consume_short_flag(arguments, "confirm"))
