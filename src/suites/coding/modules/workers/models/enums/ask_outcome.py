from enum import StrEnum


class AskOutcome(StrEnum):
    """How a worker's question ended, each with the line the worker is given."""

    ANSWERED = "answered"
    FIXED = "fixed"
    FORWARDED = "forwarded"
    MOOT = "moot"

    def worker_line(self, text: str) -> str:
        return OUTCOME_LINES[self].format(text=text)

    def description(self) -> str:
        return OUTCOME_DESCRIPTIONS[self]


OUTCOME_LINES = {
    AskOutcome.ANSWERED: "The merger answers your question: {text}",
    AskOutcome.FIXED: "The merger settled what you asked about: {text}",
    AskOutcome.FORWARDED: "Your question went to the main agent: {text}",
    AskOutcome.MOOT: "Your question is closed: {text}",
}

OUTCOME_DESCRIPTIONS = {
    AskOutcome.ANSWERED: "answered",
    AskOutcome.FIXED: "fixed",
    AskOutcome.FORWARDED: "passed on",
    AskOutcome.MOOT: "moot",
}
