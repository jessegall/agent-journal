from typing import ClassVar
from dataclasses import dataclass

from journal.models.model import Model


@dataclass(frozen=True)
class Sequence(Model):
    """Steps the agent follows in order, one at a time. Project-wide, so every environment can run it."""

    text_fields: ClassVar[tuple[str, ...]] = ("title",)
    title: str = ""
    steps: tuple[str, ...] = ()
    starts_on: str = ""
    """The row event that starts it on its own, as kind.created, such as plan.created; empty for one run by hand."""
    finishes_in: tuple[str, ...] = ()
    """The states the row a run is about must be in before its last step is done, such as a plan's ready; empty for a sequence about no row."""

    def title_words(self) -> str:
        return self.title
