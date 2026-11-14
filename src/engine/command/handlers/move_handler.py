from engine.command.context import Context
from engine.command.handler import Handler
from engine.command.move_command import MoveCommand
from engine.model.model import Model
from engine.listener.rows.event_rows import EventRows
from engine.repository.repository import Repository
from engine.command.errors.move_method_error import MoveMethodError


class MoveHandler(Handler[MoveCommand[Model], Model]):
    """Carries out every move command: finds the row, moves it, through the model's own method for the move
    when it has one, and saves it."""

    command = MoveCommand

    def __init__(self, rows: EventRows, repository: Repository) -> None:
        self.rows, self.repository = rows, repository

    def handle(self, command: MoveCommand[Model], context: Context) -> Model:
        row = self.rows.required(command.model(), command.row_id)
        fields = command.move_fields()
        method = getattr(row, command.move.name, None)
        if not callable(method):
            return self.repository.save_change(row, row.moved(command.move, **fields), context)
        moved = method(context.timestamp, context.actor, **fields)
        if not isinstance(moved, Model):
            raise MoveMethodError(f"{type(row).__name__}.{command.move.name} gave back a {type(moved).__name__}, not a model")
        return self.repository.save_change(row, moved, context)
