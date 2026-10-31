from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.processes.commands.choose_default_reader import ChooseDefaultReader
from core.modules.processes.models.reader import Reader


class ChooseDefaultReaderSubcommand(Subcommand[ChooseDefaultReader, Reader]):
    """`journal reader default <name>`: makes the reader the default of its commands."""

    cli_name = "reader"
    name = "default"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("reader_name")

    def command(self, arguments: Namespace, caller: Caller) -> ChooseDefaultReader:
        return ChooseDefaultReader(arguments.reader_name)
