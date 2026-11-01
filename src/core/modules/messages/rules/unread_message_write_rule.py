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
from core.modules.messages.support.message_nudges import UNREAD_COUNTDOWN, UNREAD_HELD

TOOL_CALLS_ALLOWED = 20
COUNTDOWN_CALLS = 5


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
        told = [message for message in unread if message.delivered_at is not None]
        if not told:
            return RuleAnswer.allowed()
        calls_left = TOOL_CALLS_ALLOWED - self.hook_calls.tool_call_count(hook.agent_id, told[0].delivered_at)
        if calls_left <= 0:
            tool = hook.event.tool
            return RuleAnswer.refused(UNREAD_HELD.nudge(count=len(told))) if tool is not None and tool.is_writing_files() else RuleAnswer.allowed()
        numbers = ", ".join(str(message.id) for message in told)
        return RuleAnswer.with_nudges(UNREAD_COUNTDOWN.nudge(messages=numbers, count=calls_left)) if calls_left <= COUNTDOWN_CALLS else RuleAnswer.allowed()
