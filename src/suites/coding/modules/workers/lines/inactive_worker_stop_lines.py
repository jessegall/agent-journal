from engine.rule_backed.rule_line_source import RuleLineSource
from suites.coding.modules.workers.rules.inactive_worker_stop_rule import InactiveWorkerStopRule


class InactiveWorkerStopLines(RuleLineSource):
    """The lines about a worker idle past its limit, in today's words of InactiveWorkerStopRule, at the agent's minute step."""

    rule = InactiveWorkerStopRule
