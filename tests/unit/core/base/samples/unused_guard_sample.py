from engine.guard.guard import Guard
from engine.model.model import Model
from engine.change.updated import Updated
from engine.command.context import Context
from tests.unit.engine.database.test_table_statements import Shelf


class ShelfGuard(Guard[Updated[Shelf]]):
    """Shelves are only changed on weekdays."""

    name = "shelves.weekdays-only"

    def check(self, event: Updated[Shelf], context: Context) -> None:
        return None
