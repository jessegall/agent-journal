from dataclasses import dataclass

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Reminder(Scoped):
    text: str = ""
