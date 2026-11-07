from typing import ClassVar

from core.base.change.event_subscriber import E, EventSubscriber
from core.base.command.context import Context


class DeletionListener(EventSubscriber[E]):
    """Runs before a row is deleted, inside the same transaction, so a module can remove or detach its own
    rows that point at it."""

    name: ClassVar[str]

    def handle(self, event: E, context: Context) -> None:
        raise NotImplementedError(f"{type(self).__name__} handles nothing")
