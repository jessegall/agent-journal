from dataclasses import dataclass

from engine.command.command import Command
from core.modules.assignments.models.assignment import Assignment


@dataclass(frozen=True)
class UnassignRow(Command[tuple[Assignment, ...]]):
    """Removes the assignment of one row from one actor, or from every actor when none is named."""

    subject_model: str
    subject_id: int
    actor_id: int | None = None
