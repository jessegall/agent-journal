from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.change.created import Created
from core.base.command.context import Context
from tests.unit.core.base.database.test_table_statements import Shelf


class ShelfCounter(SaveListener[Created[Shelf]]):
    """Counts shelves; named by path in the listener tests to see it is never imported for other events."""

    name = "shelves.count"

    def handle(self, event: Created[Shelf], context: Context) -> None:
        return None
