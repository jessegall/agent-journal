from engine.command.context import Context
from engine.command.handler import Handler
from engine.command.move_row import MoveRow
from engine.model.model import Model
from engine.model.state_book import StateBook
from engine.model.unknown_state_error import UnknownStateError
from engine.listener.event_rows import EventRows
from engine.registry.registry import Registry
from engine.repository.repository import Repository


class MoveRowHandler(Handler[MoveRow, Model]):
    """Finds a row by its model's name and takes the named move, its model's own or one a module added."""

    command = MoveRow

    def __init__(self, registry: Registry, rows: EventRows, repository: Repository, book: StateBook) -> None:
        self.registry, self.rows, self.repository, self.book = registry, rows, repository, book

    def handle(self, command: MoveRow, context: Context) -> Model:
        model = next(entry.model.checked_class(Model) for entry in self.registry.models.values() if entry.model.checked_class(Model).model_name == command.model_name)
        lifecycle = self.book.lifecycle(model)
        if lifecycle is None or not lifecycle.has_move(command.move_name):
            raise UnknownStateError(f"{command.move_name} is no move of {model.__name__}")
        row = self.rows.required(model, command.row_id)
        return self.repository.save(row.moved(lifecycle.move(command.move_name)), context)
