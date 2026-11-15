from engine.rule_backed.rule_effect import RuleEffect
from suites.coding.modules.workers.rules.cache_refresh_rule import CacheRefreshRule


class CacheRefreshEffect(RuleEffect):
    """The commands for the prompt cache's refresh before it expires, as today's CacheRefreshRule runs them at the minute tick, run at the agent's
    minute step."""

    rule = CacheRefreshRule
