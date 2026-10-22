from dataclasses import dataclass
from typing import ClassVar

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Collection(Scoped):
    """Rows that belong together, gathered under a name: its members are its links, so a row can sit in several."""

    text_fields: ClassVar[tuple[str, ...]] = ("title", "abstract")

    title: str = ""
    abstract: str = ""

    def title_words(self) -> str:
        return self.title
