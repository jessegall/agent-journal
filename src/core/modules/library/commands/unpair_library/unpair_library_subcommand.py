from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.library.commands.unpair_library.unpair_library import UnpairLibrary
from core.modules.library.support.library_disconnection import LibraryDisconnection


class UnpairLibrarySubcommand(Subcommand[UnpairLibrary, LibraryDisconnection]):
    """`journal library disconnect [--forget]`: removes the token and stops sync; --forget also deletes the copies
    and the connection."""

    cli_name = "library"
    name = "disconnect"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--forget", action="store_true")

    def command(self, arguments: Namespace, caller: Caller) -> UnpairLibrary:
        return UnpairLibrary(arguments.forget)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, LibraryDisconnection):
            output.line(f"Disconnected. {value.copies} copies {'deleted' if value.copies_deleted else 'stay and wait'}.")
