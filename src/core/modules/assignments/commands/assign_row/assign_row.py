from dataclasses import dataclass

from engine.command.command import Command
from core.modules.assignments.support.cascade import Cascade


@dataclass(frozen=True)
class AssignRow(Command[Cascade]):
    """Gives one row of an assignable model to an actor, or lets it inherit the assignment of its parent."""

    subject_model: str
    subject_id: int
    actor_id: int | None = None
    cascade: bool = True
    override: bool = False
    inherits: bool = False
