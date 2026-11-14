from dataclasses import dataclass

from engine.command.command import Command
from core.modules.assign_rules.support.rule_tasks.rule_task_list import RuleTaskList


@dataclass(frozen=True)
class ApplyAssignRule(Command[RuleTaskList]):
    """Lists the free tasks a rule would give now and to whom; once confirmed, judges them as new tasks."""

    rule_id: int
    is_confirmed: bool = False
    revision: str = ""
