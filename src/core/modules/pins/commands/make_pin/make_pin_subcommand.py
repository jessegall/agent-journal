from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.pins.commands.make_pin.make_pin import MakePin
from core.modules.pins.models.pin import Pin


class MakePinSubcommand(Subcommand[MakePin, Pin]):
    """`journal pin make <title> --link <address or row> [--label <button words>]`."""

    cli_name = "pin"
    name = "make"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("title")
        parser.add_argument("--link", required=True)
        parser.add_argument("--label", default="Open")

    def command(self, arguments: Namespace, caller: Caller) -> MakePin:
        return MakePin(arguments.title, arguments.link, arguments.label)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Pin):
            output.line(f"pin {value.id} made: {value.title} -> {value.link}")
