from core.base.command.context import Context
from core.base.command.delete_command import DeleteCommand
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository


class DeleteHandler(Handler[DeleteCommand, None]):
    """Carries out every delete command: finds the row and deletes it."""

    command = DeleteCommand

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: DeleteCommand, context: Context) -> None:
        self.repository.delete(self.queries.query(command.model()).find(command.row_id), context)
