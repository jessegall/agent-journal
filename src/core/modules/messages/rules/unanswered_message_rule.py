
from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.query.conditions.among import Among
from engine.query.conditions.greater import Greater
from engine.query.queries import Queries
from engine.query.conditions.equal import Equal
from engine.query.conditions.excluding import Excluding
from core.modules.agents.conditions.active_agent_rows import ActiveAgentRows
from core.modules.agents.models.agent import Agent
from core.modules.agents.conditions.current_session_rows import CurrentSessionRows
from core.modules.messages.queries.message_query import MessageQuery
from engine.driver.interval import Interval
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES, MessageType
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_replies import MessageReplies
from core.modules.messages.support.message_nudges import UNANSWERED, UNANSWERED_COUNTDOWN, UNANSWERED_REFUSAL, UNANSWERED_TOOL_USES
from core.modules.messages.support.block_conditions.messages_answered import MessagesAnswered

NEWEST_AGENT_MESSAGES = 50


class UnansweredMessageRule(DriverRule):
    """A message an agent has read and not answered, whoever sent it but the journal, is named before
    each tool call, and after ten calls tool calls wait for the answer; a journal message line and
    the task a message asks for always go through, since they are the answer; a prompt typed in the
    terminal is answered in the terminal. Only messages read since the agent's current session began
    or since its last message wait on it: earlier sessions handled the older ones. A message from an
    agent that has ended waits on no reply, and of the messages from running agents only the newest
    50 are checked: an unanswered one holds the agent after ten tool calls, so older ones were
    answered. The start of the current session is compared inside the message read, so it costs no
    read of its own."""

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
        agent_start = self.queries.query(Agent).find(agent_id).creation_timestamp().text
        wait_start = max(agent_start, newest_agent_message.creation_timestamp().text) if newest_agent_message is not None else agent_start
        read_people = self.read_after(agent_id, PERSON_MESSAGE_TYPES, wait_start).all_rows()
        read_agents = self.read_after(agent_id, tuple([MessageType.AGENT]), agent_start).matching(ActiveAgentRows("creator_id")).matching(Excluding(Equal("creator_id", agent_id))).newest().limited(NEWEST_AGENT_MESSAGES)
        candidates = tuple(sorted((*read_people, *read_agents), key=lambda message: message.id))
        answered = self.replies.answered_ids(agent_id, candidates)
        return tuple(message for message in candidates if message.id not in answered)

    def read_after(self, agent_id: int, types: tuple[MessageType, ...], timestamp: str) -> MessageQuery:
        return self.messages.addressed(agent_id).filter(peer_key="").matching(Among("type", types)).matching(Greater("read_at", timestamp)).matching(CurrentSessionRows("read_at", agent_id))
