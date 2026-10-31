from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.processes.commands.stop_process import StopProcess
from core.modules.processes.models.process import Process


class StopProcessSubcommand(Subcommand[StopProcess, Process]):
    """`journal output stop <n>`: kills the process group of a run and ends it stopped."""

    cli_name = "output"
    name = "stop"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("row_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> StopProcess:
        return StopProcess(arguments.row_id)
