from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.greater import Greater
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.messages.queries.message_query import MessageQuery
from core.base.driver.interval import Interval
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan
from core.base.query.conditions.among import Among
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_nudges import UNREAD_COUNTDOWN, UNREAD_REFUSAL, UNREAD_TOOL_USES
from core.modules.messages.support.block_conditions.messages_read import MessagesRead
from core.modules.messages.rules.message_delivery_rule import LISTED_MESSAGES


class UnreadMessageWriteRule(DriverRule):
    """A message the main agent was told of and has not read counts down its tool calls, and after twenty
    the agent is blocked until they are read."""

    name = "messages.unread-write"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def __init__(self, messages: MessageQuery) -> None:
        self.messages = messages

    def answer(self, hook: AgentHook) -> RuleAnswer:
        delivered = list(self.messages.unread(hook.agent_id).matching(Greater("delivered_at", "")).oldest().all_rows())
        if not delivered:
            return RuleAnswer.allowed()
        message_numbers = ", ".join(str(message.id) for message in delivered[:LISTED_MESSAGES])
        return RuleAnswer.allowed().blocking_after(hook, UNREAD_REFUSAL.nudge(count=len(delivered)), MessagesRead([message.id for message in delivered]),
                                                   Interval(ToolUseSpan(UNREAD_TOOL_USES)), UNREAD_COUNTDOWN.nudge("{left}", messages=message_numbers))
