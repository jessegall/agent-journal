from dataclasses import dataclass

from engine.command.command import Command
from core.modules.assign_rules.models.assign_rule import AssignRule


@dataclass(frozen=True)
class SwitchAssignRule(Command[AssignRule]):
    """Turns a rule on or off; a rule that is off is kept and skipped."""

    rule_id: int
    enabled: bool
    revision: str = ""
