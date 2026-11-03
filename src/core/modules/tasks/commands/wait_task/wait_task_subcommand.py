from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.tasks.commands.wait_task.wait_task import WaitTask
from core.modules.tasks.models.task import Task

DEFAULT_INTERVAL_MINUTES = 2


class WaitTaskSubcommand(Subcommand[WaitTask, Task]):
    """Blocks a task on a task, question, plan or worker, a passing command, or a written reason."""

    cli_name = "task"
    name = "block"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_id", type=int)
        parser.add_argument("--reason", default="")
        parser.add_argument("--on", action="append", default=[], help="a target that opens the task once it finishes: task:<n>, question:<n>, plan:<n> or worker:<n>")
        parser.add_argument("--until", default="", help="a shell command that opens the task once it passes")
        parser.add_argument("--every", type=int, default=DEFAULT_INTERVAL_MINUTES, help="minutes between two runs of the --until command")

    def command(self, arguments: Namespace, caller: Caller) -> WaitTask:
        return WaitTask(arguments.task_id, arguments.reason, tuple(arguments.on), arguments.until, arguments.every)
