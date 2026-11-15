from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.project_rules.rules.start_rules_rule import StartRulesRule


class StartRulesLines(RuleLineSource):
    """The lines of StartRulesRule, in today's words."""

    rule = StartRulesRule
