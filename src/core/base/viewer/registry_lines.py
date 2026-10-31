from collections.abc import Sequence
from dataclasses import dataclass

from core.base.change.event_pattern import EventPattern


@dataclass(frozen=True)
class RegistryLines:
    """What the installed modules provide a window: their read subcommands, their commands and the events their
    models raise."""

    reads: frozenset[str]
    runs: frozenset[str]
    events: Sequence[str]

    def matches(self, pattern: str) -> bool:
        return any(EventPattern(pattern).matches(event) for event in self.events)
