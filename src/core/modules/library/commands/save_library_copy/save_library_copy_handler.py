from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.library.commands.save_library_copy.save_library_copy import SaveLibraryCopy
from core.modules.library.models.library_copy import LibraryCopy


class SaveLibraryCopyHandler(Handler[SaveLibraryCopy, LibraryCopy]):
    """Writes a copy in a short transaction of its own, after the request to the server is done."""

    command = SaveLibraryCopy

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: SaveLibraryCopy, context: Context) -> LibraryCopy:
        return self.repository.save(LibraryCopy(creator_id=context.actor.id, share=command.share, item_id=command.item_id, row_id=command.row_id,
                                                base_version=command.base_version, base_digest=command.base_digest), context)
