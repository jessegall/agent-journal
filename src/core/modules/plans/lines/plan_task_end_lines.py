from core.modules.drivers.support.rule_line_source import RuleLineSource
from core.modules.plans.rules.plan_task_line_rule import PlanTaskLineRule


class PlanTaskEndLines(RuleLineSource):
    """The lines of a plan task's end, in today's words of PlanTaskLineRule."""

    rule = PlanTaskLineRule
