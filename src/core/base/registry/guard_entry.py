from dataclasses import dataclass

from core.base.change.event_pattern import EventPattern
from core.base.dotted_path.dotted_path import DottedPath


@dataclass(frozen=True)
class GuardEntry:
    """A registered guard as the registry lists it: its full name, the event it covers, the dotted path of its
    class, its place in the order, and the short flag that skips it, if its module gives one."""

    name: str
    event: EventPattern
    path: DottedPath
    position: int
    short_flag: str
    confirmation_only: bool = False

    @property
    def skip_flag(self) -> str:
        flag = f"--{self.short_flag}" if self.short_flag else f"--skip-guard {self.name}"
        if self.confirmation_only:
            return flag
        return f"{flag} --skip-reason '<why>'"
