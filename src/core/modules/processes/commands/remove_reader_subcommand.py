from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.processes.commands.remove_reader import RemoveReader
from core.modules.processes.models.reader import Reader


class RemoveReaderSubcommand(Subcommand[RemoveReader, Reader]):
    """`journal reader remove <name>`: removes a reader, except one another module made."""

    cli_name = "reader"
    name = "remove"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("reader_name")

    def command(self, arguments: Namespace, caller: Caller) -> RemoveReader:
        return RemoveReader(arguments.reader_name)
