from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.processes.commands.unwatch_output import UnwatchOutput
from core.modules.processes.models.watch import Watch


class UnwatchOutputSubcommand(Subcommand[UnwatchOutput, Watch]):
    """`journal output unwatch <n>`: stops the watch you opened on a run."""

    cli_name = "output"
    name = "unwatch"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("process_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> UnwatchOutput:
        return UnwatchOutput(arguments.process_id)
