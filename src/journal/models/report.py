from dataclasses import dataclass
from typing import ClassVar

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Report(Scoped):
    text_fields: ClassVar[tuple[str, ...]] = ("title", "abstract", "body")

    title: str = ""
    abstract: str = ""
    body: str = ""

    def title_words(self) -> str:
        return self.title

    def summary_line(self) -> str:
        return self.abstract or self.opening_line(self.body)
