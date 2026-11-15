from core.modules.drivers.support.rule_line_source import RuleLineSource
from core.modules.processes.rules.run_queue_halted_rule import RunQueueHaltedRule


class RunQueueHaltedLines(RuleLineSource):
    """The lines of RunQueueHaltedRule, in today's words."""

    rule = RunQueueHaltedRule
