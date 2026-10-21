from dataclasses import dataclass
from typing import ClassVar

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Report(Scoped):
    text_fields: ClassVar[tuple[str, ...]] = ("title", "abstract", "body")
    exports: ClassVar[bool] = True

    title: str = ""
    abstract: str = ""
    """A line that says what the report is."""
    body: str = ""

    def title_words(self) -> str:
        return self.title

    def summary(self) -> str:
        return self.abstract or self.first_line(self.body)
