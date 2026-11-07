from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.library.support.library_browse import LibraryBrowse
from core.modules.library.support.library_listing import LibraryListing
from core.modules.library.support.page_request import PageRequest


class LibraryBrowseSubcommand(ReadSubcommand[LibraryListing]):
    """Reads the library types displayed together."""

    cli_name = "library"
    name = "browse"

    def __init__(self, browse: LibraryBrowse) -> None:
        self.browse = browse

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--type", default="")
        parser.add_argument("--search", default="")

    def read(self, arguments: Namespace, caller: Caller) -> LibraryListing:
        shares = [arguments.type] if arguments.type else ["doc", "sequence", "check"]
        return LibraryListing([self.browse.page(PageRequest(share, arguments.search, 1)) for share in shares])
