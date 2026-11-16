from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RetryHandIn(Command[str]):
    """Saves a helper's kept report again, from the text kept on its job (doc 1310 section 4.9)."""

    helper_id: int
