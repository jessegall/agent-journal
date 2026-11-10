from collections.abc import Callable
from typing import TypeVar

from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.library.support.library_client import LibraryClient
from engine.library.library_item import LibraryItem
from core.modules.library.support.library_page import LibraryPage
from core.modules.library.support.library_unreachable_error import LibraryUnreachableError
from core.modules.library.support.library_versions import LibraryVersions
from core.modules.library.support.page_request import PageRequest

T = TypeVar("T")


class LibraryBrowse:
    """Reads the shared server live for a person: a page of its list with the local copy of each item, one item, and
    an item's versions. It writes nothing, and an unreachable server is a refusal in plain words."""

    def __init__(self, client: LibraryClient, queries: Queries) -> None:
        self.client, self.queries = client, queries

    def page(self, request: PageRequest) -> LibraryPage:
        page = self.reached(lambda: self.client.page(request))
        copies = {copy.item_id: copy.id for copy in self.queries.query(LibraryCopy).filter(share=request.share).all_rows()}
        return page.with_copies(copies)

    def item(self, share: str, item_id: int) -> LibraryItem:
        return self.reached(lambda: self.client.item(share, item_id))

    def versions(self, share: str, item_id: int) -> LibraryVersions:
        return self.reached(lambda: self.client.versions(share, item_id))

    @staticmethod
    def reached(read: Callable[[], T]) -> T:
        try:
            return read()
        except LibraryUnreachableError as unreachable:
            raise Refusal("The library cannot be reached. Items you already got still work.", unreachable.reason) from unreachable
