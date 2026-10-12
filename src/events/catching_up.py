"""What the catching-up feature recognises: an agent's conversation about to be compacted."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class Compacting(Fact):
    """An agent's conversation is about to be compacted, and what was said lately will be lost from it."""

    agent: int
