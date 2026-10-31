from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.modules.dumps.commands.make_dump import MakeDump
from core.modules.dumps.commands.dump_row_subcommand import DumpRowSubcommand


class MakeDumpSubcommand(DumpRowSubcommand):
    """`journal dump make "<notes>" [--parts "first | second"] [--files path ...]`."""

    name = "make"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("brief")
        parser.add_argument("--parts", default="", help="the items of the dump, split by |")
        parser.add_argument("--files", nargs="*", default=[])

    def command(self, arguments: Namespace, caller: Caller) -> MakeDump:
        return MakeDump(arguments.brief, tuple(part.strip() for part in arguments.parts.split("|") if part.strip()), tuple(arguments.files))
