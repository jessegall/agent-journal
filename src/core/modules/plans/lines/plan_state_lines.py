from core.modules.drivers.support.rule_line_source import RuleLineSource
from core.modules.plans.rules.plan_state_rule import PlanStateRule


class PlanStateLines(RuleLineSource):
    """The lines of a plan's state, in today's words of PlanStateRule."""

    rule = PlanStateRule
