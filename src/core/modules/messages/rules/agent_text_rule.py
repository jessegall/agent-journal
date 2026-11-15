from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.messages.effects.agent_text_effect import AgentTextEffect
from core.modules.messages.lines.agent_text_lines import AGENT_TEXT_KEY, AgentTextLines


class AgentTextRule(DriverRule):
    """The old walk's answer for AgentTextLines and AgentTextEffect, which own it, until the walk is deleted."""

    name = AGENT_TEXT_KEY
    hook = HookEventName.MESSAGE_DISPLAY
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, lines: AgentTextLines, effect: AgentTextEffect) -> None:
        self.lines, self.effect = lines, effect

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.with_nudges(*self.lines.nudges(hook.event, hook.agent_id)).running(*self.effect.commands_of(hook.event, hook.agent_id))
