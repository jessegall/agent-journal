from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.chat.models.chat_mark import ChatMark


class AgentChatGuard(Guard):
    """A mark for an agent is shown in the chat of the environment that agent works in, and in no other."""

    name = "chat.agent-chat"
    event = "chat_mark.*"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, change: Change[Model]) -> None:
        mark = change.new_row
        if not isinstance(mark, ChatMark) or mark.agent_id is None:
            return
        if self.queries.query(Agent).find(mark.agent_id).environment_id != mark.environment_id:
            raise Refusal(f"agent {mark.agent_id} works in another environment than the mark's", "a mark for an agent is shown in its own environment's chat")
