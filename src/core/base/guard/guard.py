from typing import ClassVar

from core.base.change.event_subscriber import E, EventSubscriber
from core.base.command.context import Context


class Guard(EventSubscriber[E]):
    """One rule a change must pass before it is saved; the class's docstring states the rule. A guard that does costly
    work outside sets runs_last, so a change every other guard refuses never reaches it."""

    name: ClassVar[str]
    short_flag: ClassVar[str] = ""
    is_safety: ClassVar[bool] = False
    runs_last: ClassVar[bool] = False

    def check(self, event: E, context: Context) -> None:
        raise NotImplementedError(f"{type(self).__name__} states no check")
