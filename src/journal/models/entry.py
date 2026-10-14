from dataclasses import dataclass

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Entry(Scoped):
    """Append only: everything that happened, from hooks and from commands."""

    kind: str = ""
    data: dict = None
