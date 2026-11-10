from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.processes.commands.confirm_output.confirm_output import ConfirmOutput
from core.modules.processes.models.watch import Watch


class ConfirmOutputSubcommand(Subcommand[ConfirmOutput, Watch]):
    """`journal output confirm <n>`: you checked that the run you wait on still does its work, and its next
    wake is later."""

    cli_name = "output"
    name = "confirm"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("process_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> ConfirmOutput:
        return ConfirmOutput(arguments.process_id)
