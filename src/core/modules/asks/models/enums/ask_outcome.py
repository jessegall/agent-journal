from enum import StrEnum


class AskOutcome(StrEnum):
    """How a question ended, and the line its asker reads about it."""

    ANSWERED = "answered"
    FIXED = "fixed"
    PARENT = "parent"
    MOOT = "moot"

    def asker_line(self, level: str, text: str) -> str:
        return {
            AskOutcome.ANSWERED: f"The {level} answers your question: {text}",
            AskOutcome.FIXED: f"The {level} settled what you asked about: {text}",
            AskOutcome.PARENT: f"Your question went to the {level}: {text}",
            AskOutcome.MOOT: f"Your question {level} is closed: {text}",
        }[self]
