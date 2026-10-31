from typing import ClassVar

from core.base.change.logged_event import LoggedEvent


class CommitListener:
    """Runs after a change is committed, from the event log, for what should follow it without undoing it."""

    name: ClassVar[str]
    event: ClassVar[str]

    def handle(self, event: LoggedEvent) -> None:
        raise NotImplementedError(f"{type(self).__name__} handles nothing")
