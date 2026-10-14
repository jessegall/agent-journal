from dataclasses import dataclass

from journal.models.actor import Actor
from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Entry(Scoped):
    """Append only: everything that happened, from hooks and from commands, and who did it."""

    kind: str = ""
    actor: Actor | None = None
    data: dict | None = None
