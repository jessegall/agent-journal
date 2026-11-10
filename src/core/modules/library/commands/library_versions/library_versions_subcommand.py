from argparse import Namespace

from engine.caller.caller import Caller
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.library.support.item_arguments import ItemArguments
from core.modules.library.support.library_browse import LibraryBrowse
from core.modules.library.support.library_versions import LibraryVersions


class LibraryVersionsSubcommand(ItemArguments, ReadSubcommand[LibraryVersions]):
    """`journal library versions <type> <id>`: the changes of an item on the shared server, each with who made it."""

    cli_name = "library"
    name = "versions"

    def __init__(self, browse: LibraryBrowse) -> None:
        self.browse = browse

    def read(self, arguments: Namespace, caller: Caller) -> LibraryVersions:
        return self.browse.versions(arguments.share, arguments.item_id)
