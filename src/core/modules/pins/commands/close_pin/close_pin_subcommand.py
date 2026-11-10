from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.pins.commands.close_pin.close_pin import ClosePin
from core.modules.pins.models.pin import Pin


class ClosePinSubcommand(Subcommand[ClosePin, Pin]):
    """`journal pin close <n>`."""

    cli_name = "pin"
    name = "close"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> ClosePin:
        return ClosePin(arguments.id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Pin):
            output.line(f"pin {value.id} closed")
