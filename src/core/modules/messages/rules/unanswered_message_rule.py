
from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.among import Among
from core.base.query.conditions.greater import Greater
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.messages.queries.message_query import MessageQuery
from core.base.driver.interval import Interval
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES, MessageType
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_replies import MessageReplies
from core.modules.messages.support.message_nudges import UNANSWERED, UNANSWERED_COUNTDOWN, UNANSWERED_REFUSAL, UNANSWERED_TOOL_USES
from core.modules.messages.support.block_conditions.messages_answered import MessagesAnswered


class UnansweredMessageRule(DriverRule):
    """A message an agent has read and not answered, whoever sent it but the journal, is named before each tool call,
    and after ten calls tool calls wait for the answer; a journal message line and the task a message asks for always go through,
    since they are the answer; a prompt typed in the terminal is answered in the terminal. Only messages read since
    the agent's session began or since its last message wait on it: earlier agents handled the older ones. A
    message from an agent that has ended waits on no reply."""

    name = "messages.unanswered"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.HELPER]

    def __init__(self, messages: MessageQuery, queries: Queries, replies: MessageReplies) -> None:
        self.messages, self.queries, self.replies = messages, queries, replies

    def answer(self, hook: AgentHook) -> RuleAnswer:
        unanswered = self.unanswered(hook.agent_id)
        tool = hook.event.tool
        if not unanswered or (tool is not None and tool.shell is not None and tool.shell.parts_running_journal_command("message", "task make")):
            return RuleAnswer.allowed()
        message_numbers = ", ".join(str(message.id) for message in unanswered)
        return RuleAnswer.with_nudges(UNANSWERED.nudge(messages=message_numbers)).blocking_after(hook, UNANSWERED_REFUSAL.nudge(messages=message_numbers, message=unanswered[0].id),
                                                                                                  MessagesAnswered([message.id for message in unanswered]), Interval(ToolUseSpan(UNANSWERED_TOOL_USES)),
                                                                                                  UNANSWERED_COUNTDOWN.nudge("{left}", messages=message_numbers))

    def unanswered(self, agent_id: int) -> tuple[Message, ...]:
        newest_agent_message = self.messages.addressed(agent_id).filter(type=MessageType.AGENT, creator_id=agent_id).newest().first()
        session_start = self.queries.query(Agent).find(agent_id).creation_timestamp().text
        waiting_since = max(session_start, newest_agent_message.creation_timestamp().text) if newest_agent_message is not None else session_start
        read_people = self.read_since(agent_id, PERSON_MESSAGE_TYPES, waiting_since)
        read_agents = self.from_running_agents(tuple(message for message in self.read_since(agent_id, (MessageType.AGENT,), session_start) if message.creator_id != agent_id))
        candidates = tuple(sorted((*read_people, *read_agents), key=lambda message: message.id))
        answered = self.replies.answered_ids(agent_id, candidates)
        return tuple(message for message in candidates if message.id not in answered)

    def from_running_agents(self, messages: tuple[Message, ...]) -> tuple[Message, ...]:
        writers = self.queries.query(Agent).matching(Among("id", tuple(dict.fromkeys(message.creator_id for message in messages)))).all_rows()
        running_ids = {writer.id for writer in writers if writer.ended_at is None and writer.retired_at is None}
        return tuple(message for message in messages if message.creator_id in running_ids)

    def read_since(self, agent_id: int, types: tuple[MessageType, ...], since: str) -> tuple[Message, ...]:
        return tuple(self.messages.addressed(agent_id).filter(peer_key="").matching(Among("type", types)).matching(Greater("read_at", since)).all_rows())
