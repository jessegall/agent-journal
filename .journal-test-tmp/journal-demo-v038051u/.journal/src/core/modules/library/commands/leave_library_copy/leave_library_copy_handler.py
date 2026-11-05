from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.library.commands.leave_library_copy.leave_library_copy import LeaveLibraryCopy
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.library.support.library_person import LibraryPerson


class LeaveLibraryCopyHandler(Handler[LeaveLibraryCopy, LibraryCopy]):
    """Deletes a copy and nothing else; it asks nothing of the server. Only a person stops following."""

    command = LeaveLibraryCopy

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: LeaveLibraryCopy, context: Context) -> LibraryCopy:
        LibraryPerson.require(context, "an agent cannot stop following for the team", "ask the user to stop following")
        copy = self.queries.query(LibraryCopy).find(command.copy_id)
        self.repository.delete(copy, context)
        return copy
