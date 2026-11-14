from dataclasses import dataclass


@dataclass(frozen=True)
class ExitText:
    """How an exit is said to an agent: the sentence and the command that takes it, when one does."""

    sentence: str
    command: str = ""
