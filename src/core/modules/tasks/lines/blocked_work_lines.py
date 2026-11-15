from engine.enums.line_carrier import LineCarrier
from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.tasks.rules.blocked_work_rule import BlockedWorkRule


class BlockedWorkLines(RuleLineSource):
    """The lines of the blocked work of an agent that stops, in today's words of BlockedWorkRule."""

    rule = BlockedWorkRule
    carrier = LineCarrier.WAITING
