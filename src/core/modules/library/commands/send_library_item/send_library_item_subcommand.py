from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.library.commands.send_library_item.send_library_item import SendLibraryItem
from core.modules.library.support.shared_library_item import SharedLibraryItem


class SendLibraryItemSubcommand(Subcommand[SendLibraryItem, SharedLibraryItem]):
    """`journal library share <type> <row>`: uploads a local row to the shared server and makes it follow the item."""

    cli_name = "library"
    name = "share"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("share", metavar="type")
        parser.add_argument("row_id", metavar="row", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> SendLibraryItem:
        return SendLibraryItem(arguments.share, arguments.row_id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, SharedLibraryItem):
            line = f"{value.copy.share} {value.copy.row_id} is now library {value.item.share} {value.item.item_id}, version {value.item.version}"
            output.write("\n".join([line, value.warning] if value.warning else [line]), {"line": line, "warning": value.warning, "copy_id": value.copy.id})
