from engine.listener.save_listener import SaveListener
from engine.model.model import Model
from engine.event.created import Created
from engine.command.context import Context
from tests.unit.engine.database.test_table_statements import Shelf


class ShelfCounter(SaveListener[Created[Shelf]]):
    """Counts shelves; named by path in the listener tests to see it is never imported for other events."""

    name = "shelves.count"

    def handle(self, event: Created[Shelf], context: Context) -> None:
        return None
