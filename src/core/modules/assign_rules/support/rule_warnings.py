from collections.abc import Sequence

from core.modules.assign_rules.support.condition_line import ConditionLine


class RuleWarnings:
    """Warns of a rule whose matching tasks another module sends to another program than the rule's target runs
    on; answered by a module that sends tasks by rules of its own, and empty without one."""

    def warning(self, program: str, lines: Sequence[ConditionLine]) -> str:
        return ""
