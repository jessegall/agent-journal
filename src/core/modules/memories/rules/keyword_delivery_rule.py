from engine.agent.enums.role_group import RoleGroup
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_wildcard import HookWildcard
from core.modules.memories.effects.give_memories_effect import GiveMemoriesEffect
from core.modules.memories.lines.keyword_delivery_lines import KEYWORD_DELIVERY_KEY, KeywordDeliveryLines


class KeywordDeliveryRule(DriverRule):
    """The old walk's answer for KeywordDeliveryLines and GiveMemoriesEffect, which own it, until the walk is deleted."""

    name = KEYWORD_DELIVERY_KEY
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    role_group = RoleGroup.PROMPT

    def __init__(self, lines: KeywordDeliveryLines, effect: GiveMemoriesEffect) -> None:
        self.lines, self.effect = lines, effect

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.with_nudges(*self.lines.nudges(hook.event, hook.agent_id)).running(*self.effect.commands_of(hook.event, hook.agent_id))
