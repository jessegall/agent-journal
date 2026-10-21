from dataclasses import dataclass
from typing import ClassVar

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Fact(Scoped):
    text_fields: ClassVar[tuple[str, ...]] = ("text",)

    text: str = ""
    keywords: tuple[str, ...] = ()
    """Words that, when the agent writes one, bring the row back to it as a whisper."""

    def summary(self) -> str:
        return self.first_line(self.text)
