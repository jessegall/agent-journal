from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.library.commands.make_library_copy.make_library_copy import MakeLibraryCopy
from core.modules.library.support.item_arguments import ItemArguments
from core.modules.library.support.new_library_copy import NewLibraryCopy


class MakeLibraryCopySubcommand(ItemArguments, Subcommand[MakeLibraryCopy, NewLibraryCopy]):
    """`journal library get <type> <id> [--read]`: makes a local row from an item of the shared server and makes it
    follow the item."""

    cli_name = "library"
    name = "get"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        super().arguments(parser)
        parser.add_argument("--read", action="store_true", dest="has_read")

    def command(self, arguments: Namespace, caller: Caller) -> MakeLibraryCopy:
        return MakeLibraryCopy(arguments.share, arguments.item_id, arguments.has_read)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, NewLibraryCopy):
            line = f"library {value.item.share} {value.item.item_id}, version {value.item.version} is now {value.copy.share} {value.copy.row_id}"
            output.write(line, {"line": line, "copy_id": value.copy.id, "row_id": value.copy.row_id})
