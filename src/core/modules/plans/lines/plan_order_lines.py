from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.plans.rules.plan_order_rule import PlanOrderRule


class PlanOrderLines(RuleLineSource):
    """The lines of a plan's task order, in today's words of PlanOrderRule."""

    rule = PlanOrderRule
