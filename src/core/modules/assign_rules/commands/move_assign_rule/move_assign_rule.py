from dataclasses import dataclass

from engine.command.command import Command
from core.modules.assign_rules.models.assign_rule import AssignRule


@dataclass(frozen=True)
class MoveAssignRule(Command[AssignRule]):
    """Moves a rule up or down to a place in its environment's order, where the first match wins."""

    rule_id: int
    position: int
