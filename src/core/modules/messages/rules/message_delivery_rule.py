from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_wildcard import HookWildcard
from core.modules.messages.effects.message_delivery_effect import MessageDeliveryEffect
from core.modules.messages.lines.new_message_lines import MESSAGE_DELIVERY_KEY, NewMessageLines


class MessageDeliveryRule(DriverRule):
    """The old walk's answer for NewMessageLines and MessageDeliveryEffect, which own it, until the walk is deleted."""

    name = MESSAGE_DELIVERY_KEY
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    overlay_proof = True
    is_notice = True

    def __init__(self, lines: NewMessageLines, effect: MessageDeliveryEffect) -> None:
        self.lines, self.effect = lines, effect

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.with_nudges(*self.lines.nudges(hook.event, hook.agent_id)).running(*self.effect.commands_of(hook.event, hook.agent_id))
