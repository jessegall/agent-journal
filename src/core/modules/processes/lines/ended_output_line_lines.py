from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.processes.rules.ended_output_line_rule import EndedOutputLineRule


class EndedOutputLineLines(RuleLineSource):
    """The lines of EndedOutputLineRule, in today's words."""

    rule = EndedOutputLineRule
