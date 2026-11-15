from engine.rule_backed.rule_line_source import RuleLineSource
from suites.coding.modules.workers.rules.worker_log_due_rule import WorkerLogDueRule


class WorkerLogDueLines(RuleLineSource):
    """The lines of WorkerLogDueRule, in today's words."""

    rule = WorkerLogDueRule
