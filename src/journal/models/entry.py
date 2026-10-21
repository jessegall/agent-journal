from dataclasses import dataclass
from typing import ClassVar

from journal.support.actor import Actor
from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Entry(Scoped):
    """Append only: everything that happened, from hooks and from commands, and who did it; it is the timeline itself, so it is in no timeline, and a tool entry carries the call's one reading beside the raw hook."""

    in_timeline: ClassVar[bool] = False

    kind: str = ""
    actor: Actor | None = None
    data: dict | None = None

    def recorded_call(self) -> dict:
        return (self.data or {}).get("call", {})

    def is_write(self) -> bool:
        return not (self.data or {}).get("refused") and bool(self.recorded_call().get("writes"))
