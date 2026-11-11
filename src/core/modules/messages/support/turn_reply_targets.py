from engine.time.clock import Clock
from engine.time.timestamp import Timestamp
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.messages.support.message_reactions import MessageReactions


class TurnReplyTargets:
    """The message the text of an agent's turn answers: the newest person message that arrived while the agent
    was idle, after its last turn ended and before the prompt that started this turn, and that has no reply
    of the agent yet. A message that arrived in the middle of a turn is answered by a reply command, or by the
    text of the turn that starts after it."""

    def __init__(self, hook_calls: HookCallQuery, messages: MessageQuery, clock: Clock) -> None:
        self.hook_calls, self.messages, self.clock = hook_calls, messages, clock

    def current_parent_id(self, agent_id: int, text: str) -> int | None:
        return self.parent_id(agent_id, text, self.clock.timestamp())

    def parent_id(self, agent_id: int, text: str, text_created_at: Timestamp) -> int | None:
        prompt = self.hook_calls.latest_prompt(agent_id, text_created_at)
        if prompt is None or MessageReactions.is_emoji(text):
            return None
        previous = self.hook_calls.last_allowed_stop(agent_id, prompt.creation_timestamp())
        arrived = self.messages.person_messages_in_span(agent_id, previous.creation_timestamp().text if previous is not None else "", prompt.creation_timestamp()).newest().first()
        if arrived is None or self.messages.replies(arrived.id).agent_messages().exists():
            return None
        return arrived.id
