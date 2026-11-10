from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from core.modules.library.commands.make_library_copy.make_library_copy import MakeLibraryCopy
from core.modules.library.commands.save_library_copy.save_library_copy import SaveLibraryCopy
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.library.support.arriving_row import ArrivingRow
from core.modules.library.support.library_browse import LibraryBrowse
from core.modules.library.support.library_shares import LibraryShares
from core.modules.library.support.new_library_copy import NewLibraryCopy


class MakeLibraryCopyHandler(Handler[MakeLibraryCopy, NewLibraryCopy]):
    """Checks the type and the item, reads the item with no write lock held, then makes the row and its copy in a
    short transaction. An item that comes with a warning is made only when it was read first."""

    command = MakeLibraryCopy

    def __init__(self, shares: LibraryShares, browse: LibraryBrowse, queries: Queries, bus: Bus) -> None:
        self.shares, self.browse, self.queries, self.bus = shares, browse, queries, bus

    def handle(self, command: MakeLibraryCopy, context: Context) -> NewLibraryCopy:
        share = self.shares.lookup(command.share)
        self.refuse_repeat(command)
        item = self.browse.item(command.share, command.item_id)
        if item.is_removed:
            raise Refusal(f"library {command.share} {command.item_id} is removed from the library", "an admin brings it back with journal library restore")
        warning = share.warning(item.fields)
        if warning and not command.has_read:
            raise Refusal(warning, f"read it with journal library show {command.share} {command.item_id}, then get it with --read")
        copy = self.bus.run(SaveLibraryCopy(command.share, item.item_id, item.version, ArrivingRow(item.fields)), context.actor)
        return NewLibraryCopy(copy, item)

    def refuse_repeat(self, command: MakeLibraryCopy) -> None:
        followed = self.queries.query(LibraryCopy).filter(share=command.share, item_id=command.item_id).first()
        if followed is not None:
            raise Refusal(f"library {command.share} {command.item_id} is already {command.share} {followed.row_id} on this journal",
                          f"journal {command.share} show {followed.row_id} reads it; journal library leave {followed.id} stops following")
