from typing import ClassVar
from collections.abc import Sequence

from core.base.change.event_subscriber import E, EventSubscriber
from core.base.change.logged_event import LoggedEvent
from core.base.scope.scopes import DisabledScopes


class CommitListener(EventSubscriber[E]):
    """Runs after a change is committed, from the event log, for what should follow it without undoing it. Listeners
    run by run_order, lowest first, so one that a person waits on goes before slow work."""

    name: ClassVar[str]
    run_order: ClassVar[int] = 0
    disabled_scopes: ClassVar[DisabledScopes] = ()

    def prepare(self, events: Sequence[LoggedEvent]) -> None:
        return None

    def handle(self, event: E, logged: LoggedEvent) -> None:
        raise NotImplementedError(f"{type(self).__name__} handles nothing")
