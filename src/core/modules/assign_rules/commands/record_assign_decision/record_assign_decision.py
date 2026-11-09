from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.assign_rules.models.assign_decision import AssignDecision


@dataclass(frozen=True)
class RecordAssignDecision(Command[AssignDecision]):
    """Judges one task against the assign rules and records the decision."""

    task_id: int
