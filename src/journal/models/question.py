import re
from dataclasses import dataclass
from typing import ClassVar

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Question(Scoped):
    text_fields: ClassVar[tuple[str, ...]] = ("text", "answer")
    PERSONAL: ClassVar[re.Pattern] = re.compile(r"\b(i|i'll|i'm|i've|me|my|we|we'll|us|our|you|you'll|you're|your)\b", re.IGNORECASE)

    text: str = ""
    options: tuple[str, ...] = ()
    answer: str | None = None

    def is_answered(self) -> bool:
        return self.answer is not None

    def is_settled(self) -> bool:
        """Nothing waiting on it waits any longer."""
        return self.is_answered()

    def unclear_options(self) -> list[str]:
        """The options that say I, we or you, where the reader cannot tell whether the agent or the user is meant."""
        return [option for option in self.options if self.PERSONAL.search(option)]

    def answered(self, answer: str) -> "Question":
        return self.with_(answer=answer)

