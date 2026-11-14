from typing import ClassVar, TypeIs
from collections.abc import Sequence

from engine.event.event_subscriber import E, EventSubscriber
from engine.event.logged_event import LoggedEvent
from engine.scope.scopes import DisabledScopes


class CommitListener(EventSubscriber[E]):
    """Runs after a change is committed, from the event log, for what should follow it without undoing it. Listeners
    run by run_order, lowest first, so one that a user waits on goes before slow work."""

    name: ClassVar[str]
    run_order: ClassVar[int] = 0
    disabled_scopes: ClassVar[DisabledScopes] = ()

    def prepare(self, events: Sequence[LoggedEvent]) -> None:
        return None

    def handle(self, event: E, logged: LoggedEvent) -> None:
        raise NotImplementedError(f"{type(self).__name__} handles nothing")


def is_commit_listener_class(class_type: type) -> TypeIs[type[CommitListener[object]]]:
    return issubclass(class_type, CommitListener)
