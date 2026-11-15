from core.modules.drivers.support.rule_policy import RulePolicy
from core.modules.processes.rules.reading_rule import ReadingRule


class ReadingPolicy(RulePolicy):
    """The refusal of ReadingRule, with today's text, as a policy of the new driver."""

    rule = ReadingRule
    rank = "shell.all"
