from engine.rule_backed.rule_line_source import RuleLineSource
from suites.coding.rules.introduction_rule import IntroductionRule


class IntroductionLines(RuleLineSource):
    """The lines of IntroductionRule, in today's words."""

    rule = IntroductionRule
