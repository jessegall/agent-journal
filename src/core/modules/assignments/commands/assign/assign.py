from dataclasses import dataclass

from engine.command.command import Command
from core.modules.assignments.models.assignment import Assignment


@dataclass(frozen=True)
class Assign(Command[tuple[Assignment, ...]]):
    """Gives one row of an assignable model to an actor."""

    subject_model: str
    subject_id: int
    actor_id: int
    cascade: bool = True
    override: bool = False
