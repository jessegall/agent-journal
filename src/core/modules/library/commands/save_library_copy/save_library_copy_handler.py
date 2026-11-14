from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.library.commands.save_library_copy.save_library_copy import SaveLibraryCopy
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.library.support.library_shares import LibraryShares


class SaveLibraryCopyHandler(Handler[SaveLibraryCopy, LibraryCopy]):
    """Writes a copy in a short transaction of its own, after the request to the server is done, and makes its row
    first when it comes from an item just fetched."""

    command = SaveLibraryCopy
    runs_once = True

    def __init__(self, repository: Repository, shares: LibraryShares) -> None:
        self.repository, self.shares = repository, shares

    def handle(self, command: SaveLibraryCopy, context: Context) -> LibraryCopy:
        row = command.source.kept(self.shares.lookup(command.share), context)
        return self.repository.save(LibraryCopy(creator_id=context.actor.id, share=command.share, item_id=command.item_id, row_id=row.row_id,
                                                base_version=command.base_version, base_digest=row.digest), context)
