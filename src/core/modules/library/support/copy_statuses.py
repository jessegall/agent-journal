from core.base.library.library_share import LibraryShare
from engine.model.model import Model
from engine.query.queries import Queries
from core.modules.library.models.enums.copy_progress import CopyProgress
from core.modules.library.models.enums.copy_state import CopyState
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.library.queries.library_connection_query import LibraryConnectionQuery
from core.modules.library.support.copy_status import CopyStatus
from core.modules.library.support.library_client import LibraryClient
from core.modules.library.support.library_shares import LibraryShares


class CopyStatuses:
    """Works out the status of each copy when it is read, from the stored state, the digest of its row against the
    digest both sides last agreed on, and whether the server was reached. A change on its way is never stored."""

    def __init__(self, queries: Queries, shares: LibraryShares, connections: LibraryConnectionQuery, client: LibraryClient) -> None:
        self.queries, self.shares, self.connections, self.client = queries, shares, connections, client

    def all_statuses(self) -> tuple[CopyStatus, ...]:
        copies = self.queries.query(LibraryCopy).all_rows()
        return tuple(status for status in (self.status(copy) for copy in copies) if status is not None)

    def status(self, copy: LibraryCopy) -> CopyStatus | None:
        share = self.shares.lookup(copy.share)
        row = self.queries.query(share.model).filter(id=copy.row_id).first()
        if row is None:
            return None
        return CopyStatus(copy, self.progress(copy, share, row), share.fields(row))

    def progress(self, copy: LibraryCopy, share: LibraryShare[Model], row: Model) -> CopyProgress:
        if copy.state is not CopyState.SYNCED:
            return CopyProgress(copy.state.value)
        if share.digest(row) != copy.base_digest:
            return CopyProgress.SENDING if self.reaches_server() else CopyProgress.UNSENT
        if copy.server_version > copy.base_version and share.is_paused(row):
            return CopyProgress.PAUSED
        return CopyProgress.SYNCED

    def reaches_server(self) -> bool:
        connection = self.connections.current()
        return connection is not None and not connection.failure and self.client.is_connected
