from engine.command.context import Context
from engine.command.delete_command import DeleteCommand
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.repository.repository import Repository


class DeleteHandler(Handler[DeleteCommand, None]):
    """Carries out every delete command: finds the row and deletes it."""

    command = DeleteCommand

    def __init__(self, rows: EventRows, repository: Repository) -> None:
        self.rows, self.repository = rows, repository

    def handle(self, command: DeleteCommand, context: Context) -> None:
        self.repository.delete_stored(self.rows.required(command.model(), command.row_id), context)
