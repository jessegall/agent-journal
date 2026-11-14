from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.modules.dumps.commands.name_dump.name_dump import NameDump
from core.modules.dumps.commands.dump_row.dump_row_subcommand import DumpRowSubcommand


class NameDumpSubcommand(DumpRowSubcommand):
    """`journal dump name <dump> "<title>"`."""

    name = "name"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("dump_id", type=int)
        parser.add_argument("title")

    def command(self, arguments: Namespace, caller: Caller) -> NameDump:
        return NameDump(arguments.dump_id, arguments.title)
