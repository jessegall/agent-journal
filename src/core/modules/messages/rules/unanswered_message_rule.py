import re

from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.greater import Greater
from core.base.query.queries import Queries
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_nudges import UNANSWERED, UNANSWERED_COUNTDOWN, UNANSWERED_REFUSAL

ALLOWED_TOOL_CALL_COUNT = 10
COUNTDOWN_CALL_COUNT = 3
REPLY_LINE = re.compile(r"(?:^|-- '|&& |; )journal message ")


class UnansweredMessageRule(DriverRule):
    """A message the main agent has read and not answered is named before each tool call, and after ten calls tool
    calls wait for the answer; a journal message line always goes through, since it is the answer."""

    name = "messages.unanswered"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, hook_calls: HookCallQuery) -> None:
        self.queries, self.hook_calls = queries, hook_calls

    def answer(self, hook: AgentHook) -> RuleAnswer:
        unanswered = self.unanswered(hook.environment_id)
        tool = hook.event.tool
        if not unanswered or (tool is not None and tool.shell is not None and REPLY_LINE.search(tool.shell.line)):
            return RuleAnswer.allowed()
        message_numbers = ", ".join(str(message.id) for message in unanswered)
        remaining_calls = ALLOWED_TOOL_CALL_COUNT - self.hook_calls.tool_call_count(hook.agent_id, unanswered[0].read_at)
        if remaining_calls <= 0:
            return RuleAnswer.refused(UNANSWERED_REFUSAL.nudge(messages=message_numbers, message=unanswered[0].id))
        return RuleAnswer.with_nudges(UNANSWERED_COUNTDOWN.nudge(messages=message_numbers, count=remaining_calls) if remaining_calls <= COUNTDOWN_CALL_COUNT else UNANSWERED.nudge(messages=message_numbers))

    def unanswered(self, environment_id: int) -> tuple[Message, ...]:
        agent_messages = self.queries.query(Message).filter(environment_id=environment_id, type=MessageType.AGENT).newest().page(1, 1).rows
        read_messages = self.queries.query(Message).filter(environment_id=environment_id, type=MessageType.USER).matching(Greater("read_at", agent_messages[0].created_at.text if agent_messages else ""))
        return tuple(read_messages.oldest().all_rows())
