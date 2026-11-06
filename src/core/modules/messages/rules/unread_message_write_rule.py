from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.greater import Greater
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.base.query.conditions.among import Among
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_nudges import UNREAD_COUNTDOWN, UNREAD_REFUSAL, UNREAD_TOOL_USES
from core.modules.messages.support.block_conditions.messages_read import MessagesRead
from core.modules.messages.rules.message_delivery_rule import LISTED_MESSAGES

COUNTDOWN_CALL_COUNT = 5


class UnreadMessageWriteRule(DriverRule):
    """A message the main agent was told of and has not read counts down its tool calls, and after twenty
    the agent is blocked until they are read."""

    name = "messages.unread-write"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def __init__(self, messages: MessageQuery, hook_calls: HookCallQuery) -> None:
        self.messages, self.hook_calls = messages, hook_calls

    def answer(self, hook: AgentHook) -> RuleAnswer:
        delivered = self.messages.unread(hook.agent_id).matching(Greater("delivered_at", "")).oldest()
        first = delivered.first()
        first_delivered_at = first.delivered_at if first is not None else None
        if first_delivered_at is None:
            return RuleAnswer.allowed()
        remaining_calls = UNREAD_TOOL_USES - self.hook_calls.tool_call_count(hook.agent_id, first_delivered_at)
        if remaining_calls <= 0:
            return RuleAnswer.blocked(hook, UNREAD_REFUSAL.nudge(count=delivered.count()), MessagesRead([message.id for message in delivered.all_rows()]))
        if remaining_calls > COUNTDOWN_CALL_COUNT:
            return RuleAnswer.allowed()
        message_numbers = ", ".join(str(message.id) for message in delivered.page(1, LISTED_MESSAGES).rows)
        return RuleAnswer.with_nudges(UNREAD_COUNTDOWN.nudge(remaining_calls, messages=message_numbers))
