from core.base.command.context import Context
from core.base.command.edit_command import EditCommand
from core.base.command.handler import Handler
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.repository.repository import Repository


class EditHandler(Handler[EditCommand[Model], Model]):
    """Carries out every edit command: changes only the fields the command gives and saves the row."""

    command = EditCommand

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: EditCommand[Model], context: Context) -> Model:
        row = self.queries.query(command.model()).find(command.row_id)
        return self.repository.save(row.changed(**command.changed_fields()), context)
