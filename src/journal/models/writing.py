from dataclasses import dataclass

from journal.models.base import Scoped


@dataclass(frozen=True)
class Report(Scoped):
    title: str = ""
    body: str = ""


@dataclass(frozen=True)
class Doc(Scoped):
    title: str = ""
    body: str = ""
