from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.library.support.library_browse import LibraryBrowse
from core.modules.library.support.library_page import LibraryPage
from core.modules.library.support.page_request import PageRequest


class LibraryListSubcommand(ReadSubcommand[LibraryPage]):
    """`journal library list [--type t] [--search words] [--page n]`: a live page of the shared server's items, each
    with the number of the local copy that follows it."""

    cli_name = "library"
    name = "list"

    def __init__(self, browse: LibraryBrowse) -> None:
        self.browse = browse

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--type", dest="share", default="doc")
        parser.add_argument("--search", default="")
        parser.add_argument("--page", type=int, default=1)

    def read(self, arguments: Namespace, caller: Caller) -> LibraryPage:
        return self.browse.page(PageRequest(arguments.share, arguments.search, arguments.page))
