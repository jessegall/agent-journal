from typing import ClassVar, TypeIs
from collections.abc import Sequence

from engine.event.event_subscriber import E, EventSubscriber
from engine.command.context import Context


class DeletionListener(EventSubscriber[E]):
    """Runs before a row is deleted, inside the same transaction, so a module can remove or detach its own
    rows that point at it."""

    name: ClassVar[str]

    def handle(self, event: E, context: Context) -> None:
        raise NotImplementedError(f"{type(self).__name__} handles nothing")

    def handle_many(self, events: Sequence[E], context: Context) -> None:
        for event in events:
            self.handle(event, context)


def is_deletion_listener_class(class_type: type) -> TypeIs[type[DeletionListener[object]]]:
    return issubclass(class_type, DeletionListener)
