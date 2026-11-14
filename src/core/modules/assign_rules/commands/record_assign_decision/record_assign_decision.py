from dataclasses import dataclass

from engine.command.command import Command
from core.modules.assign_rules.models.assign_decision import AssignDecision


@dataclass(frozen=True)
class RecordAssignDecision(Command[tuple[AssignDecision, ...]]):
    """Judges tasks against the assign rules in one step and records a decision for each."""

    task_ids: tuple[int, ...]
