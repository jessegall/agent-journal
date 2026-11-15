from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.effects.cache_refresh_effect import CacheRefreshEffect
from suites.coding.modules.workers.lines.cache_refresh_lines import CacheRefreshLines
from suites.coding.modules.workers.support.cache_keepalive import CACHE_KEEPALIVE_KEY


class CacheRefreshRule(DriverRule):
    """The old walk's answer for CacheRefreshLines and CacheRefreshEffect, which own it, until the walk is deleted."""

    name = CACHE_KEEPALIVE_KEY
    hook = HookEventName.TICK
    drivers = ["*"]
    roles = [AgentRole.MAIN]
    disabled_scopes = [ActorScope]

    def __init__(self, lines: CacheRefreshLines, effect: CacheRefreshEffect) -> None:
        self.lines, self.effect = lines, effect

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.with_nudges(*self.lines.nudges(hook.event, hook.agent_id)).running(*self.effect.commands_of(hook.event, hook.agent_id))
