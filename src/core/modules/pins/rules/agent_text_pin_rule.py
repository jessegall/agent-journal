from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.pins.effects.agent_text_pin_effect import AgentTextPinEffect
from core.modules.pins.lines.agent_text_pin_lines import AGENT_TEXT_PIN_KEY, AgentTextPinLines


class AgentTextPinRule(DriverRule):
    """The old walk's answer for AgentTextPinLines and AgentTextPinEffect, which own it, until the walk is deleted."""

    name = AGENT_TEXT_PIN_KEY
    hook = HookEventName.MESSAGE_DISPLAY
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, lines: AgentTextPinLines, effect: AgentTextPinEffect) -> None:
        self.lines, self.effect = lines, effect

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.with_nudges(*self.lines.nudges(hook.event, hook.agent_id)).running(*self.effect.commands_of(hook.event, hook.agent_id))
