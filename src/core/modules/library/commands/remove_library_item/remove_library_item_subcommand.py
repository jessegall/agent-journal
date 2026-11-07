from argparse import Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.library.commands.remove_library_item.remove_library_item import RemoveLibraryItem
from core.modules.library.support.item_arguments import ItemArguments
from core.base.library.library_item import LibraryItem


class RemoveLibraryItemSubcommand(ItemArguments, Subcommand[RemoveLibraryItem, LibraryItem]):
    """`journal library remove <type> <id>`: marks an item removed on the shared server; every copy stays."""

    cli_name = "library"
    name = "remove"
    outward = True

    def command(self, arguments: Namespace, caller: Caller) -> RemoveLibraryItem:
        return RemoveLibraryItem(arguments.share, arguments.item_id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, LibraryItem):
            output.line(f"library {value.share} {value.item_id} is removed, as version {value.version}")
