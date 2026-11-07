from dataclasses import dataclass


@dataclass(frozen=True)
class RepeatedFinding:
    """One thing a request repeated. The key names the finding by its kind, its SQL text without parameters and the
    last calls that led to it, so the same finding has the same key whatever row or route met it;
    the text is what a person reads."""

    key: str
    text: str
