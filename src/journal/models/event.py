from dataclasses import dataclass

from journal.models.base import Scoped


@dataclass(frozen=True)
class Event(Scoped):
    """Append only: everything that happened, from hooks and from commands."""

    kind: str = ""
    data: dict = None
