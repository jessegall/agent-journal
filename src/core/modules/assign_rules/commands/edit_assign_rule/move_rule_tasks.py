from dataclasses import dataclass

from engine.command.command import Command
from core.modules.assign_rules.support.rule_tasks.rule_task_list import RuleTaskList


@dataclass(frozen=True)
class MoveRuleTasks(Command[RuleTaskList]):
    """Lists the unstarted tasks a rule gave that its target now differs from; once confirmed, moves them."""

    rule_id: int
    is_confirmed: bool = False
    revision: str = ""
