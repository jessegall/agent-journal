from dataclasses import dataclass
from typing import ClassVar

from journal.models.model import Model
from journal.models.suggestion_answer import SuggestionAnswer


@dataclass(frozen=True)
class Suggestion(Model):
    """Something the journal suggested to the user once, such as running a package as a journal plugin, and how they answered; one row a key, so it is never suggested again."""

    text_fields: ClassVar[tuple[str, ...]] = ("title",)

    key: str = ""
    title: str = ""
    answer: SuggestionAnswer | None = None

    def is_answered(self) -> bool:
        return self.answer is not None

    def answered(self, answer: SuggestionAnswer) -> "Suggestion":
        return self.with_(answer=answer)
