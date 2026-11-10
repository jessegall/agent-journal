from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.query.conditions.greater import Greater
from core.modules.messages.queries.message_query import MessageQuery
from engine.driver.interval import Interval
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan
from core.modules.messages.support.message_nudges import UNREAD_COUNTDOWN, UNREAD_REFUSAL, UNREAD_TOOL_USES
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
        waiting = self.messages.unread(hook.agent_id).matching(Greater("delivered_at", "")).oldest()
        delivered = waiting.limited(MESSAGE_COUNT_SHOWN)
        if not delivered:
            return RuleAnswer.allowed()
        count = waiting.count() if len(delivered) == MESSAGE_COUNT_SHOWN else len(delivered)
        message_numbers = ", ".join(str(message.id) for message in delivered)
        return RuleAnswer.allowed().blocking_after(hook, UNREAD_REFUSAL.nudge(count=count), MessagesRead([message.id for message in delivered]),
                                                   Interval(ToolUseSpan(UNREAD_TOOL_USES)), UNREAD_COUNTDOWN.nudge("{left}", messages=message_numbers))
