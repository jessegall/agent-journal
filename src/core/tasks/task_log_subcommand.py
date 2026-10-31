from argparse import ArgumentParser, Namespace
from dataclasses import dataclass

from core.base.command.make_command import MakeCommand
from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.tasks.task_log import TaskLog


@dataclass(frozen=True)
class TaskLogMake(MakeCommand[TaskLog]):
    task_id: int
    line: str


class TaskLogSubcommand(Subcommand[TaskLogMake, TaskLog]):
    """`journal task log <task> "<line>"`: writes a line on a task."""

    cli_noun = "task"
    name = "log"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_id", type=int)
        parser.add_argument("line")

    def command(self, arguments: Namespace, caller: Caller) -> TaskLogMake:
        return TaskLogMake(arguments.task_id, arguments.line)
