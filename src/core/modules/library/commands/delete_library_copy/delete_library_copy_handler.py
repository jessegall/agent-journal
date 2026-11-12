from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.library.commands.delete_library_copy.delete_library_copy import DeleteLibraryCopy
from core.modules.library.models.library_copy import LibraryCopy


class DeleteLibraryCopyHandler(Handler[DeleteLibraryCopy, LibraryCopy]):
    """Deletes a copy for a sync round; unlike leaving, no user asks for it."""

    command = DeleteLibraryCopy

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: DeleteLibraryCopy, context: Context) -> LibraryCopy:
        copy = self.queries.query(LibraryCopy).find(command.copy_id)
        self.repository.delete(copy, context)
        return copy
