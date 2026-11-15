from engine.rule_backed.rule_line_source import RuleLineSource
from suites.coding.modules.workers.rules.cache_refresh_rule import CacheRefreshRule


class CacheRefreshLines(RuleLineSource):
    """The lines about the prompt cache's refresh before it expires, in today's words of CacheRefreshRule, at the agent's minute step."""

    rule = CacheRefreshRule
