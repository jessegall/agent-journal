from dataclasses import dataclass

from core.base.change.event_pattern import EventPattern
from core.base.module.dotted_path import DottedPath


@dataclass(frozen=True)
class GuardEntry:
    """A registered guard as the registry lists it: its full name, the event it covers, where its class lives,
    its place in the order, and the short flag that skips it, if its module gives one."""

    name: str
    event: EventPattern
    path: DottedPath
    position: int
    short_flag: str

    @property
    def skip_flag(self) -> str:
        return f"--{self.short_flag}" if self.short_flag else f"--skip-guard {self.name}"
