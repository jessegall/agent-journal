from dataclasses import dataclass
from typing import ClassVar

from journal.support.actor import Actor
from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Entry(Scoped):
    """Append only: everything that happened, from hooks and from commands, and who did it."""

    in_timeline: ClassVar[bool] = False
    """It is the timeline itself."""

    kind: str = ""
    actor: Actor | None = None
    data: dict | None = None
