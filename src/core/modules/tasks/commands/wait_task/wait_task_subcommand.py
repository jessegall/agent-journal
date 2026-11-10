from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.tasks.commands.wait_task.wait_task import WaitTask
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.task_wait_targets import TaskWaitTargets

DEFAULT_INTERVAL_MINUTES = 2


class WaitTaskSubcommand(Subcommand[WaitTask, Task]):
    """Blocks a task on declared targets, a passing command or a written reason."""

    cli_name = "task"
    name = "block"
    outward = True

    def __init__(self, targets: TaskWaitTargets) -> None:
        self.targets = targets

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_id", type=int)
        parser.add_argument("--reason", default="")
        parser.add_argument("--on", action="append", default=[], help=f"a target that opens the task once it finishes; {self.targets.target_help}")
        parser.add_argument("--until", default="", help="a shell command that opens the task once it passes")
        parser.add_argument("--every", type=int, default=DEFAULT_INTERVAL_MINUTES, help="minutes between two runs of the --until command")
        parser.add_argument("--until-user", dest="user_wait", action="store_true", help="wait for a person; use --reason to describe the required action")

    def command(self, arguments: Namespace, caller: Caller) -> WaitTask:
        return WaitTask(arguments.task_id, arguments.reason, tuple(arguments.on), arguments.until, arguments.every, arguments.user_wait)
