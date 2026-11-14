from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.messages.states.unread_countdown import UnreadCountdown
from core.modules.messages.support.block_conditions.messages_read import MessagesRead

MESSAGE_COUNT_SHOWN = 3


class UnreadMessageWriteRule(DriverRule):
    """A message the main agent was told of and has not read counts down its tool calls, and after twenty
    the agent is blocked until they are read."""

    name = "messages.unread-write"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def __init__(self, messages: MessageQuery) -> None:
        self.messages = messages

    def answer(self, hook: AgentHook) -> RuleAnswer:
        waiting = self.messages.delivered_unread(hook.agent_id)
        delivered = waiting.take(MESSAGE_COUNT_SHOWN)
        if not delivered:
            return RuleAnswer.allowed()
        count = waiting.count() if len(delivered) == MESSAGE_COUNT_SHOWN else len(delivered)
        message_numbers = ", ".join(str(message.id) for message in delivered)
        return RuleAnswer.allowed().running(UnreadCountdown.start(hook, MessagesRead([message.id for message in delivered]), {"count": count}, messages=message_numbers))
