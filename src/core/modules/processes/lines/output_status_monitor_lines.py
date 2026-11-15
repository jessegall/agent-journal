from core.modules.drivers.support.rule_line_source import RuleLineSource
from core.modules.processes.rules.output_status_monitor_rule import OutputStatusMonitorRule


class OutputStatusMonitorLines(RuleLineSource):
    """The lines of OutputStatusMonitorRule, in today's words."""

    rule = OutputStatusMonitorRule
