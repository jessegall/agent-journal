from dataclasses import asdict

from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.library.commands.update_library_copy.update_library_copy import UpdateLibraryCopy
from core.modules.library.models.library_copy import LibraryCopy


class UpdateLibraryCopyHandler(Handler[UpdateLibraryCopy, LibraryCopy]):
    """Reads the copy in its own transaction and writes the state and each value the round gave."""

    command = UpdateLibraryCopy

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: UpdateLibraryCopy, context: Context) -> LibraryCopy:
        copy = self.queries.query(LibraryCopy).find(command.copy_id)
        given = {name: value for name, value in asdict(command).items() if name != "copy_id" and value is not None}
        return self.repository.update(copy, context, **given)
