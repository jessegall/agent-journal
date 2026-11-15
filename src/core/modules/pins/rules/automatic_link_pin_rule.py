from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.pins.effects.automatic_link_pin_effect import AutomaticLinkPinEffect


class AutomaticLinkPinRule(DriverRule):
    """The old walk's answer for AutomaticLinkPinEffect, which owns it, until the walk is deleted."""

    name = AutomaticLinkPinEffect.key
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]

    def __init__(self, effect: AutomaticLinkPinEffect) -> None:
        self.effect = effect

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed().running(*self.effect.commands_of(hook.event, hook.agent_id))
