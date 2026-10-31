from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model


class ShelfCounter(SaveListener):
    """Counts shelves; named by path in the listener tests to see it is never imported for second_connection events."""

    name = "shelves.count"
    event = "shelf.create"

    def handle(self, change: Change[Model]) -> None:
        return None
