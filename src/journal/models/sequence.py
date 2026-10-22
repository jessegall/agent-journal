from typing import ClassVar
from dataclasses import dataclass

from journal.models.model import Model


@dataclass(frozen=True)
class Sequence(Model):
    """Steps the agent follows in order, one at a time. Project-wide, so every environment can run it."""

    text_fields: ClassVar[tuple[str, ...]] = ("title",)
    title: str = ""
    steps: tuple[str, ...] = ()
    trigger_event: str = ""
    end_condition: tuple[str, ...] = ()

    def title_words(self) -> str:
        return self.title
