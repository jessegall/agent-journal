from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.drivers.rules.continued_session_rule import ContinuedSessionRule


class ContinuedSessionLines(RuleLineSource):
    """The lines of ContinuedSessionRule, in today's words."""

    rule = ContinuedSessionRule
