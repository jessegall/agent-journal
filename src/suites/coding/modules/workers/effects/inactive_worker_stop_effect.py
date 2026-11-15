from engine.rule_backed.rule_effect import RuleEffect
from suites.coding.modules.workers.rules.inactive_worker_stop_rule import InactiveWorkerStopRule


class InactiveWorkerStopEffect(RuleEffect):
    """The commands for a worker idle past its limit, as today's InactiveWorkerStopRule runs them at the minute tick, run at the agent's
    minute step."""

    rule = InactiveWorkerStopRule
