from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.repository.stale_row_error import StaleRowError
from core.modules.library.commands.merge_library_item.merge_library_item import MergeLibraryItem
from core.modules.library.models.enums.copy_state import CopyState
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.library.support.library_shares import LibraryShares


class MergeLibraryItemHandler(Handler[MergeLibraryItem, LibraryCopy]):
    """Reads the copy and its row in one transaction, lets the share bring the row to the item's fields, and
    writes the new base from the row it made. A row that changed since the round read it is a stale row error,
    and the next round sees the same difference again."""

    command = MergeLibraryItem

    def __init__(self, queries: Queries, repository: Repository, shares: LibraryShares) -> None:
        self.queries, self.repository, self.shares = queries, repository, shares

    def handle(self, command: MergeLibraryItem, context: Context) -> LibraryCopy:
        copy = self.queries.query(LibraryCopy).find(command.copy_id)
        share = self.shares.lookup(copy.share)
        row = self.queries.query(share.model).find(copy.row_id)
        if row.version != command.row_version:
            raise StaleRowError(row.cli_name, row.id)
        followed = share.follow(row, command.item.fields, context)
        return self.repository.update(copy, context, base_version=command.item.version, base_digest=share.digest(followed), state=CopyState.SYNCED, unsent_digest="",
                                      server_version=0, server_fields="{}", note="")
