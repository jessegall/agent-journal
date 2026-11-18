from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.processes.commands.stop_processes.stop_processes import StopProcesses
from core.modules.processes.models.process import Process


class StopProcessSubcommand(Subcommand[StopProcesses, tuple[Process, ...]]):
    """`journal output stop <n> [<n> ...]`: kills the process group of each run named and ends it stopped."""

    cli_name = "output"
    name = "stop"
    external = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("row_ids", type=int, nargs="+")

    def command(self, arguments: Namespace, caller: Caller) -> StopProcesses:
        return StopProcesses(tuple(arguments.row_ids))
