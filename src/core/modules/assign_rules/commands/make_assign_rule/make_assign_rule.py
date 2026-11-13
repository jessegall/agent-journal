from dataclasses import dataclass

from engine.command.command import Command
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.models.enums.rule_target import RuleTarget
from core.modules.assign_rules.support.condition_line import ConditionLine


@dataclass(frozen=True)
class MakeAssignRule(Command[AssignRule]):
    """Adds a rule with its conditions at the end of the environment's rules."""

    target: RuleTarget
    conditions: tuple[ConditionLine, ...]
    agent_id: int | None = None
    program: str = ""
    program_model: str = ""
    queue_limit: int = 0
