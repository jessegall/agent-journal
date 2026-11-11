from dataclasses import dataclass

from engine.command.command import Command
from core.modules.assignments.support.cascade import Cascade


@dataclass(frozen=True)
class AssignRow(Command[Cascade]):
    """Gives one row of an assignable model to an actor."""

    subject_model: str
    subject_id: int
    actor_id: int
    cascade: bool = True
    override: bool = False
