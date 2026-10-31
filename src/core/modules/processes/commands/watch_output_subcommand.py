from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.processes.commands.watch_output import WatchOutput
from core.modules.processes.models.watch import Watch


class WatchOutputSubcommand(Subcommand[WatchOutput, Watch]):
    """`journal output watch <n>`: after every tool use you are given the reader's new lines of the run, until it ends."""

    cli_name = "output"
    name = "watch"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("process_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> WatchOutput:
        return WatchOutput(arguments.process_id)
