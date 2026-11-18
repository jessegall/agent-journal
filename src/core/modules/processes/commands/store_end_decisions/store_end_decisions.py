from dataclasses import dataclass

from engine.command.command import Command
from core.modules.processes.support.decisions.decided_part import DecidedPart


@dataclass(frozen=True)
class StoreEndDecisions(Command[None]):
    """Keeps the reading decision of each part of a run whose output has all its text, decided before the write."""

    process_id: int
    decided: tuple[DecidedPart, ...]
