from dataclasses import dataclass

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Report(Scoped):
    title: str = ""
    body: str = ""
