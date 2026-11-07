
from core.base.actor_type import ActorType
from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.among import Among
from core.base.query.conditions.greater import Greater
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES, MessageType
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_reactions import MessageReactions
from core.modules.messages.support.message_nudges import UNANSWERED, UNANSWERED_COUNTDOWN, UNANSWERED_REFUSAL, UNANSWERED_TOOL_USES
from core.modules.messages.support.block_conditions.messages_answered import MessagesAnswered

COUNTDOWN_CALL_COUNT = 3


class UnansweredMessageRule(DriverRule):
    """A message the main agent has read and not answered is named before each tool call, and after ten calls
    tool calls wait for the answer; a journal message line and the task a message asks for always go through,
    since they are the answer; a prompt typed in the terminal is answered in the terminal."""

    name = "messages.unanswered"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, messages: MessageQuery, hook_calls: HookCallQuery) -> None:
        self.messages, self.hook_calls = messages, hook_calls

    def answer(self, hook: AgentHook) -> RuleAnswer:
        unanswered = self.unanswered(hook.agent_id)
        tool = hook.event.tool
        if not unanswered or (tool is not None and tool.shell is not None and tool.shell.parts_running_journal_command("message", "task make")):
            return RuleAnswer.allowed()
        message_numbers = ", ".join(str(message.id) for message in unanswered)
        first_read_at = next(message.read_at for message in unanswered if message.read_at is not None)
        remaining_calls = UNANSWERED_TOOL_USES - self.hook_calls.tool_call_count(hook.agent_id, first_read_at)
        if remaining_calls <= 0:
            return RuleAnswer.blocked(hook, UNANSWERED_REFUSAL.nudge(messages=message_numbers, message=unanswered[0].id), MessagesAnswered([message.id for message in unanswered]))
        return RuleAnswer.with_nudges(UNANSWERED_COUNTDOWN.nudge(remaining_calls, messages=message_numbers) if remaining_calls <= COUNTDOWN_CALL_COUNT else UNANSWERED.nudge(messages=message_numbers))

    def unanswered(self, agent_id: int) -> tuple[Message, ...]:
        newest_agent_message = self.messages.addressed(agent_id).filter(type=MessageType.AGENT, creator_id=agent_id).newest().first()
        read_messages = self.messages.addressed(agent_id).filter(peer_key="").matching(Among("type", PERSON_MESSAGE_TYPES)).matching(Greater("read_at", newest_agent_message.creation_timestamp().text if newest_agent_message is not None else ""))
        candidates = tuple(read_messages.oldest().all_rows())
        answered: set[int | None] = {reply.parent_id for reply in self.messages.addressed(agent_id).filter(type=MessageType.AGENT, creator_id=agent_id).matching(Among("parent_id", tuple(message.id for message in candidates))).all_rows()} if candidates else set()
        return tuple(message for message in candidates if message.id not in answered and not MessageReactions.has_actor(message, ActorType.AGENT.value))
