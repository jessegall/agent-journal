from datetime import timedelta

from engine.time.clock import Clock
from engine.time.timestamp import Timestamp
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.messages.support.message_reactions import MessageReactions

EARLIEST_STEP = timedelta(microseconds=1)


class TurnReplyTargets:
    """The message the text of an agent's turn answers: the newest person message that arrived while the agent
    was idle, after its last turn ended and before the prompt that started this turn, and that has no reply
    of the agent yet. A message that arrived in the middle of a turn is answered by a reply command, or by
    the text of the turn that starts after it. Before the agent's first stop the span starts when the agent
    was made: a message older than the agent was never one it was idle for."""

    def __init__(self, hook_calls: HookCallQuery, messages: MessageQuery, clock: Clock, agents: AgentRows) -> None:
        self.hook_calls, self.messages, self.clock, self.agents = hook_calls, messages, clock, agents

    def current_parent_id(self, agent_id: int, text: str) -> int | None:
        return self.parent_id(agent_id, text, self.clock.timestamp())

    def parent_id(self, agent_id: int, text: str, text_created_at: Timestamp) -> int | None:
        prompt = self.hook_calls.latest_prompt(agent_id, text_created_at)
        if prompt is None or MessageReactions.is_emoji(text):
            return None
        previous = self.hook_calls.last_allowed_stop(agent_id, prompt.creation_timestamp())
        idle_start = previous.creation_timestamp() if previous is not None else self.agent_creation_time(agent_id)
        unanswered_message = self.messages.person_messages_during(agent_id, idle_start.text, prompt.creation_timestamp()).newest().first()
        if unanswered_message is None or self.messages.replies(unanswered_message.id).agent_messages().exists():
            return None
        return unanswered_message.id

    def agent_creation_time(self, agent_id: int) -> Timestamp:
        return Timestamp(self.agents.find(agent_id).creation_timestamp().value - EARLIEST_STEP)
