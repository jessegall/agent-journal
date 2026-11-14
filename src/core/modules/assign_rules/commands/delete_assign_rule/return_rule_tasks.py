from dataclasses import dataclass

from engine.command.command import Command
from core.modules.assign_rules.support.rule_tasks.rule_task_list import RuleTaskList


@dataclass(frozen=True)
class ReturnRuleTasks(Command[RuleTaskList]):
    """Lists the unstarted tasks a rule gave, also a deleted rule; once confirmed, unassigns them."""

    rule_id: int
    is_confirmed: bool = False
    revision: str = ""
