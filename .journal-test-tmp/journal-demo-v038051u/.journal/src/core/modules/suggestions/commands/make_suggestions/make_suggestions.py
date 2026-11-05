from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class MakeSuggestions(Command[int]):
    """Offers each suggestion that applies to this project and was never offered before."""
