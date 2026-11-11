from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class StoreEndDecisions(Command[None]):
    """Keeps the reading decision of each part of a run whose output has all its text."""

    process_id: int
