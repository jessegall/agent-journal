from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.messages.effects.message_read_effect import MessageReadEffect
from core.modules.messages.lines.message_read_lines import MESSAGE_READ_KEY, MessageReadLines


class MessageReadRule(DriverRule):
    """The old walk's answer for MessageReadLines and MessageReadEffect, which own it, until the walk is deleted."""

    name = MESSAGE_READ_KEY
    overlay_proof = True
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]

    def __init__(self, lines: MessageReadLines, effect: MessageReadEffect) -> None:
        self.lines, self.effect = lines, effect

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.with_nudges(*self.lines.nudges(hook.event, hook.agent_id)).running(*self.effect.commands_of(hook.event, hook.agent_id))
