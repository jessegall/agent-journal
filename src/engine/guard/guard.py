from typing import ClassVar

from engine.event.event_subscriber import E, EventSubscriber
from engine.command.context import Context


class Guard(EventSubscriber[E]):
    """Checks a rule before a change is saved."""

    name: ClassVar[str]
    short_flag: ClassVar[str] = ""
    is_confirmation: ClassVar[bool] = False
    is_safety: ClassVar[bool] = False
    runs_last: ClassVar[bool] = False
    runs_first: ClassVar[bool] = False

    def check(self, event: E, context: Context) -> None:
        raise NotImplementedError(f"{type(self).__name__} states no check")
