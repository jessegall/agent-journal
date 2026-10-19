from dataclasses import dataclass
from typing import ClassVar

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Report(Scoped):
    text_fields: ClassVar[tuple[str, ...]] = ("title", "abstract", "body")

    title: str = ""
    abstract: str = ""
    """A line that says what the report is."""
    body: str = ""

