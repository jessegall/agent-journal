from core.modules.drivers.support.rule_policy import RulePolicy
from core.modules.processes.rules.hand_made_monitor_rule import HandMadeMonitorRule


class HandMadeMonitorPolicy(RulePolicy):
    """The refusal of HandMadeMonitorRule, with today's text, as a policy of the new driver."""

    rule = HandMadeMonitorRule
    rank = "shell.all"
