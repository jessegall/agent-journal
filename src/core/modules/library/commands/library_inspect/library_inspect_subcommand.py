from argparse import Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.library.support.item_arguments import ItemArguments
from core.modules.library.support.library_browse import LibraryBrowse
from core.modules.library.support.library_inspection import LibraryInspection


class LibraryInspectSubcommand(ItemArguments, ReadSubcommand[LibraryInspection]):
    """Reads an item and its versions together."""

    cli_name = "library"
    name = "inspect"

    def __init__(self, browse: LibraryBrowse) -> None:
        self.browse = browse

    def read(self, arguments: Namespace, caller: Caller) -> LibraryInspection:
        return LibraryInspection(self.browse.item(arguments.share, arguments.item_id), self.browse.versions(arguments.share, arguments.item_id))
