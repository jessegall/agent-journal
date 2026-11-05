from core.base.command.context import Context
from core.base.command.edit_command import EditCommand
from core.base.command.handler import Handler
from core.base.model.model import Model
from core.base.listener.event_rows import EventRows
from core.base.repository.repository import Repository


class EditHandler(Handler[EditCommand[Model], Model]):
    """Carries out every edit command: changes only the fields the command gives and saves the row."""

    command = EditCommand

    def __init__(self, rows: EventRows, repository: Repository) -> None:
        self.rows, self.repository = rows, repository

    def handle(self, command: EditCommand[Model], context: Context) -> Model:
        row = self.rows.required(command.model(), command.row_id)
        return self.repository.update(row, context, **command.changed_fields())
