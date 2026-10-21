from dataclasses import dataclass
from typing import ClassVar

from journal.models.model import Model


@dataclass(frozen=True)
class Doc(Model):
    """A document of the project, the same in every environment: a title, a line that says what it is, and its text."""

    text_fields: ClassVar[tuple[str, ...]] = ("title", "abstract", "body")

    title: str = ""
    abstract: str = ""
    body: str = ""

    def title_words(self) -> str:
        return self.title

    def summary_line(self) -> str:
        return self.abstract or self.first_line(self.body)
