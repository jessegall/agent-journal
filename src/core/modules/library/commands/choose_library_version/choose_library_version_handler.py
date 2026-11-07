from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.library.commands.merge_library_item.merge_library_item import MergeLibraryItem
from core.modules.library.commands.choose_library_version.choose_library_version import ChooseLibraryVersion
from core.modules.library.models.enums.kept_side import KeptSide
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.library.queries.library_connection_query import LibraryConnectionQuery
from core.modules.library.support.library_browse import LibraryBrowse
from core.modules.library.support.library_person import LibraryPerson
from core.modules.library.support.library_shares import LibraryShares
from core.modules.library.support.library_stopped_error import LibraryStoppedError
from core.modules.library.ticks.library_sync import LibrarySync


class ChooseLibraryVersionHandler(Handler[ChooseLibraryVersion, LibraryCopy]):
    """Keeps the person's text by sending it with the version they were shown, or keeps the library's by
    copying the row to the item. Both ask the server with no write lock held; only a person chooses."""

    command = ChooseLibraryVersion

    def __init__(self, queries: Queries, shares: LibraryShares, connections: LibraryConnectionQuery, sync: LibrarySync, browse: LibraryBrowse, bus: Bus) -> None:
        self.queries, self.shares, self.connections, self.sync, self.browse, self.bus = queries, shares, connections, sync, browse, bus

    def handle(self, command: ChooseLibraryVersion, context: Context) -> LibraryCopy:
        LibraryPerson.require(context, "only a person chooses between a copy and its item", "ask the user to choose on the Teams page")
        copy = self.queries.query(LibraryCopy).find(command.copy_id)
        if not copy.state.needs_choice:
            raise Refusal(f"{copy.share} {copy.row_id} has nothing to resolve: it is {copy.state.value}", "journal library copies shows what needs a choice")
        share = self.shares.lookup(copy.share)
        row = self.queries.query(share.model).find(copy.row_id)
        if command.keep is KeptSide.MINE:
            self.keep_mine(copy, row, share.digest(row))
        else:
            self.keep_library(copy, row, context)
        return self.queries.query(LibraryCopy).find(copy.id)

    def keep_mine(self, copy: LibraryCopy, row: Model, digest: str) -> None:
        connection = self.connections.current()
        if connection is None:
            raise LibraryStoppedError.disconnected()
        self.sync.send(copy.with_server_version(), row, digest, connection.role)

    def keep_library(self, copy: LibraryCopy, row: Model, context: Context) -> None:
        share = self.shares.lookup(copy.share)
        if share.is_paused(row):
            raise Refusal(f"this {copy.share} is running", "use the library's version when the run ends")
        item = self.browse.item(copy.share, copy.item_id)
        if item.is_removed:
            raise Refusal(f"library {copy.share} {copy.item_id} is removed from the library", "leave the copy, or wait for an admin to restore the item")
        self.bus.run(MergeLibraryItem(copy.id, item, row.version), context.actor)
