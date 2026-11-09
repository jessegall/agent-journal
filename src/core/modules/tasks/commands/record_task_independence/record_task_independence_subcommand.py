from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.tasks.commands.record_task_independence.record_task_independence import RecordTaskIndependence
from core.modules.tasks.models.task import Task


class RecordTaskIndependenceSubcommand(Subcommand[RecordTaskIndependence, Task]):
    """`journal task waits-on-nothing <task> --why "<why>"`: the task truly waits on no other."""

    cli_name = "task"
    name = "waits-on-nothing"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_id", type=int)
        parser.add_argument("--why", required=True)

    def command(self, arguments: Namespace, caller: Caller) -> RecordTaskIndependence:
        return RecordTaskIndependence(arguments.task_id, arguments.why)
