from argparse import Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.library.support.item_arguments import ItemArguments
from core.modules.library.support.library_browse import LibraryBrowse
from core.base.library.library_item import LibraryItem


class LibraryShowSubcommand(ItemArguments, ReadSubcommand[LibraryItem]):
    """`journal library show <type> <id>`: a live read of one item of the shared server; it saves nothing."""

    cli_name = "library"
    name = "show"

    def __init__(self, browse: LibraryBrowse) -> None:
        self.browse = browse

    def read(self, arguments: Namespace, caller: Caller) -> LibraryItem:
        return self.browse.item(arguments.share, arguments.item_id)
