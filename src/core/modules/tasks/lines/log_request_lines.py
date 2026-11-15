from core.modules.drivers.support.rule_line_source import RuleLineSource
from core.modules.tasks.rules.log_request_rule import LogRequestRule


class LogRequestLines(RuleLineSource):
    """The lines of a request to log the task, in today's words of LogRequestRule."""

    rule = LogRequestRule
