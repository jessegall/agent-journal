from argparse import ArgumentParser, Namespace
from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.tasks.models.task_log import TaskLog
from core.modules.tasks.commands.make_task_log.make_task_log import MakeTaskLog


class MakeTaskLogSubcommand(Subcommand[MakeTaskLog, TaskLog]):
    """`journal task log <task> "<line>"`: writes a line on a task."""

    cli_name = "task"
    name = "log"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_id", type=int)
        parser.add_argument("line")
        parser.add_argument("--important", action="store_true", help="the work differs from what the task asked, or something was left out or could not be worked out")

    def command(self, arguments: Namespace, caller: Caller) -> MakeTaskLog:
        return MakeTaskLog(arguments.task_id, arguments.line, important=arguments.important)
