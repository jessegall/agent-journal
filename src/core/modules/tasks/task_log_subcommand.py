from argparse import ArgumentParser, Namespace
from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.tasks.task_log import TaskLog
from core.modules.tasks.make_task_log import MakeTaskLog


class TaskLogSubcommand(Subcommand[MakeTaskLog, TaskLog]):
    """`journal task log <task> "<line>"`: writes a line on a task."""

    cli_name = "task"
    name = "log"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_id", type=int)
        parser.add_argument("line")

    def command(self, arguments: Namespace, caller: Caller) -> MakeTaskLog:
        return MakeTaskLog(arguments.task_id, arguments.line)
