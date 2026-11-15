from core.modules.drivers.support.rule_line_source import RuleLineSource
from core.modules.plans.rules.plan_focus_rule import PlanFocusRule


class PlanFocusLines(RuleLineSource):
    """The lines of the agent's plan focus, in today's words of PlanFocusRule."""

    rule = PlanFocusRule
