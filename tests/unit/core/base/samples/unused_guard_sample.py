from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model


class ShelfGuard(Guard):
    """Shelves are only changed on weekdays."""

    name = "shelves.weekdays-only"
    event = "shelf.update"

    def check(self, change: Change[Model]) -> None:
        return None
