from collections.abc import Sequence

from core.base.library.library_hits import LibraryHits
from core.base.library.library_item import LibraryItem
from core.base.library.library_lookup import LibraryLookup
from core.base.library.library_ref import LibraryRef
from core.base.query.queries import Queries
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.library.support.kept_library_failure import KeptLibraryFailure
from core.modules.library.support.library_browse import LibraryBrowse
from core.modules.library.support.library_client import LibraryClient
from core.modules.library.support.library_failure_error import LibraryFailureError
from core.modules.library.support.page_request import PageRequest

FIND_LIMIT_SECONDS = 2


class ServerLibraryLookup(LibraryLookup):
    """Answers find and read commands from the shared server: a search waits two seconds at most, asks nothing when
    this journal is not connected, and after a failure asks nothing for a minute."""

    def __init__(self, client: LibraryClient, browse: LibraryBrowse, queries: Queries, failure: KeptLibraryFailure) -> None:
        self.client, self.browse, self.queries, self.failure = client, browse, queries, failure

    def hits(self, terms: Sequence[str], shares: Sequence[str]) -> LibraryHits:
        if not self.client.is_connected:
            return LibraryHits()
        if self.failure.is_kept():
            return LibraryHits(is_unreachable=True)
        try:
            return LibraryHits(tuple(hit for share in shares for hit in self.client.page(PageRequest(share, " ".join(terms), 1), FIND_LIMIT_SECONDS).hits()))
        except LibraryFailureError as failed:
            self.failure.keep(failed.reason)
            return LibraryHits(is_unreachable=True)

    def item(self, share: str, ref: LibraryRef) -> LibraryItem | None:
        return self.browse.item(share, ref.item_id)

    def title(self, share: str, item_id: int) -> str | None:
        if not self.can_reach():
            return None
        try:
            return str(self.client.item(share, item_id).fields.get("title", ""))
        except LibraryFailureError as failed:
            self.failure.keep(failed.reason)
            return None

    def is_copy(self, share: str, row_id: int) -> bool:
        return self.queries.query(LibraryCopy).filter(share=share, row_id=row_id).exists()

    def can_reach(self) -> bool:
        return self.client.is_connected and not self.failure.is_kept()
