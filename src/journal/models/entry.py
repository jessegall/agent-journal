from dataclasses import dataclass, field
from typing import ClassVar

from journal.support.actor import Actor
from journal.support.recorded_call import RecordedCall
from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Entry(Scoped):
    """Append only: everything that happened, from hooks and from commands, and who did it; it is the timeline itself, so it is in no timeline, and a tool entry carries the call's one reading beside the raw hook."""

    timeline_visible: ClassVar[bool] = False

    kind: str = ""
    actor: Actor | None = None
    data: dict = field(default_factory=dict)

    def recorded_call(self) -> RecordedCall:
        return RecordedCall.parsed(self.data.get("call", {}))

    def is_write(self) -> bool:
        return not self.data.get("refused") and self.recorded_call().writes
