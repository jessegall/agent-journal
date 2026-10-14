"""What the starting agents feature recognises: a message for an environment that has no agent running."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class WakeRequested(Fact):
    """The user wrote to an environment where no agent runs, whose last conversation is to be carried on."""

    environment: str
    n: int
    provider: str
    conversation: str
