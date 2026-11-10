from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.library.commands.leave_library_copy.leave_library_copy import LeaveLibraryCopy
from core.modules.library.models.library_copy import LibraryCopy


class LeaveLibraryCopySubcommand(Subcommand[LeaveLibraryCopy, LibraryCopy]):
    """`journal library leave <copy>`: stops a row from following its item; both sides keep what they have."""

    cli_name = "library"
    name = "leave"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("copy_id", metavar="copy", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> LeaveLibraryCopy:
        return LeaveLibraryCopy(arguments.copy_id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, LibraryCopy):
            line = f"{value.share} {value.row_id} no longer follows library {value.share} {value.item_id}"
            output.write(line, {"line": line, "row_id": value.row_id})
