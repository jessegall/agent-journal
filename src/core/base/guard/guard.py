from typing import ClassVar

from core.base.change.event_subscriber import E, EventSubscriber
from core.base.command.context import Context


class Guard(EventSubscriber[E]):
    """Checks a rule before a change is saved."""

    name: ClassVar[str]
    short_flag: ClassVar[str] = ""
    confirmation_only: ClassVar[bool] = False
    is_safety: ClassVar[bool] = False
    runs_last: ClassVar[bool] = False

    def check(self, event: E, context: Context) -> None:
        raise NotImplementedError(f"{type(self).__name__} states no check")
