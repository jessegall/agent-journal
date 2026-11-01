from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_nudges import UNREAD_COUNTDOWN, UNREAD_REFUSAL

ALLOWED_TOOL_CALL_COUNT = 20
COUNTDOWN_CALL_COUNT = 5


class UnreadMessageWriteRule(DriverRule):
    """A message the main agent was told of and has not read counts down its tool calls, and after twenty a write
    waits until it is read; reading is no write, so it always goes through."""

    name = "messages.unread-write"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, hook_calls: HookCallQuery) -> None:
        self.queries, self.hook_calls = queries, hook_calls

    def answer(self, hook: AgentHook) -> RuleAnswer:
        unread = self.queries.query(Message).filter(environment_id=hook.environment_id, type=MessageType.USER).matching(IsNull("read_at")).oldest().all_rows()
        delivered = [message for message in unread if message.delivered_at is not None]
        first_delivered_at = next((message.delivered_at for message in delivered if message.delivered_at is not None), None)
        if first_delivered_at is None:
            return RuleAnswer.allowed()
        remaining_calls = ALLOWED_TOOL_CALL_COUNT - self.hook_calls.tool_call_count(hook.agent_id, first_delivered_at)
        if remaining_calls <= 0:
            tool = hook.event.tool
            return RuleAnswer.refused(UNREAD_REFUSAL.nudge(count=len(delivered))) if tool is not None and tool.is_writing_files() else RuleAnswer.allowed()
        message_numbers = ", ".join(str(message.id) for message in delivered)
        return RuleAnswer.with_nudges(UNREAD_COUNTDOWN.nudge(messages=message_numbers, count=remaining_calls)) if remaining_calls <= COUNTDOWN_CALL_COUNT else RuleAnswer.allowed()
