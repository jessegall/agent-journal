from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.memories.rules.start_delivery_rule import StartDeliveryRule


class StartDeliveryLines(RuleLineSource):
    """The lines of how many memories an agent is given at its start, in today's words of StartDeliveryRule."""

    rule = StartDeliveryRule
