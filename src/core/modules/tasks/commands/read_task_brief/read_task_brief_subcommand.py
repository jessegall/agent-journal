from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.tasks.commands.read_task_brief.read_task_brief import ReadTaskBrief
from core.modules.tasks.support.task_brief import TaskBrief


class ReadTaskBriefSubcommand(Subcommand[ReadTaskBrief, TaskBrief]):
    """`journal task overview <n>`: a task's title, brief, last comments and last log lines; an agent given a
    task is blocked until it ran this in its context window."""

    cli_name = "task"
    name = "overview"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> ReadTaskBrief:
        return ReadTaskBrief(arguments.task_id)
