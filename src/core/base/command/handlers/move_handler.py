from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.command.move_command import MoveCommand
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.repository.repository import Repository


class MoveMethodError(Exception):
    """Raised when a model's method for a move gives back something other than a model."""


class MoveHandler(Handler[MoveCommand[Model], Model]):
    """Carries out every move command: finds the row, moves it, through the model's own method for the move when
    it has one, and saves it."""

    command = MoveCommand

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: MoveCommand[Model], context: Context) -> Model:
        row = self.queries.query(command.model()).find(command.row_id)
        fields = command.move_fields()
        method = getattr(row, command.move.name, None)
        if not callable(method):
            return self.repository.save(row.moved(command.move, **fields), context)
        moved = method(context.moment, context.actor, **fields)
        if not isinstance(moved, Model):
            raise MoveMethodError(f"{type(row).__name__}.{command.move.name} gave back a {type(moved).__name__}, not a model")
        return self.repository.save(moved, context)
