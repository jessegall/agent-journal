from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.messages.effects.typed_prompt_effect import TypedPromptEffect


class TypedPromptRule(DriverRule):
    """The old walk's answer for TypedPromptEffect, which owns it, until the walk is deleted."""

    name = TypedPromptEffect.key
    hook = HookEventName.PROMPT
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, effect: TypedPromptEffect) -> None:
        self.effect = effect

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed().running(*self.effect.commands_of(hook.event, hook.agent_id))
