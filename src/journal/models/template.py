from typing import ClassVar
from dataclasses import dataclass

from journal.models.model import Model


@dataclass(frozen=True)
class Template(Model):
    """Saved instructions and a starting outline for new items, written once and used many times. Project-wide."""

    text_fields: ClassVar[tuple[str, ...]] = ("title", "purpose", "brief")
    title: str = ""
    applies_to: tuple[str, ...] = ()
    purpose: str = ""
    brief: str = ""
    parts: tuple[str, ...] = ()

    def title_words(self) -> str:
        return self.title

    def summary_line(self) -> str:
        return self.first_line(self.brief)
