from argparse import ArgumentParser, Namespace
from typing import ClassVar

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.dumps.commands.move_dump_item import MoveDumpItem
from core.modules.dumps.commands.support.dump_line import DumpLine


class DumpItemSubcommand(Subcommand[MoveDumpItem, DumpLine]):
    """What `journal dump note`, `filed` and `failed` share: they take a dump, an item and words, and print the line
    the dump answers."""

    action: ClassVar[str]
    cli_name = "dump"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("dump_id", type=int)
        parser.add_argument("item")
        parser.add_argument("text")
        parser.add_argument("--refs", nargs="*", default=[], help="the rows it became, as table:id")

    def command(self, arguments: Namespace, caller: Caller) -> MoveDumpItem:
        return MoveDumpItem(arguments.dump_id, arguments.item, self.action, arguments.text, tuple(arguments.refs))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, DumpLine):
            output.line(value.text)
