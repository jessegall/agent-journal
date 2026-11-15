from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.processes.rules.run_title_rule import RunTitleRule


class RunTitleLines(RuleLineSource):
    """The lines of RunTitleRule, in today's words."""

    rule = RunTitleRule
