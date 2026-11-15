from engine.rule_backed.rule_effect import RuleEffect
from suites.coding.modules.workers.rules.missing_process_rule import MissingProcessRule


class MissingProcessEffect(RuleEffect):
    """The commands for an agent whose program is gone, as today's MissingProcessRule runs them at the minute tick, run at the agent's
    minute step."""

    rule = MissingProcessRule
