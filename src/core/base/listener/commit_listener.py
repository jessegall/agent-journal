from typing import ClassVar

from core.base.change.logged_event import LoggedEvent
from core.base.scope.scopes import DisabledScopes


class CommitListener:
    """Runs after a change is committed, from the event log, for what should follow it without undoing it. Listeners
    run by run_order, lowest first, so one that a person waits on goes before slow work."""

    name: ClassVar[str]
    event: ClassVar[str]
    run_order: ClassVar[int] = 0
    disabled_scopes: ClassVar[DisabledScopes] = ()

    def handle(self, event: LoggedEvent) -> None:
        raise NotImplementedError(f"{type(self).__name__} handles nothing")
