from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.library.commands.pair_library.pair_library import PairLibrary
from core.modules.library.models.library_connection import LibraryConnection


class PairLibrarySubcommand(Subcommand[PairLibrary, LibraryConnection]):
    """`journal library connect [<address>] --token <token> [--certificate <file>]`: connects to the team's shared
    server; the address is the setting's when left out."""

    cli_name = "library"
    name = "connect"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("address", nargs="?", default="")
        parser.add_argument("--token", required=True)
        parser.add_argument("--certificate", default="")

    def command(self, arguments: Namespace, caller: Caller) -> PairLibrary:
        return PairLibrary(arguments.token, arguments.address, arguments.certificate)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, LibraryConnection):
            output.line(f"Connected: {value.name}. Role: {value.role.value}.")
