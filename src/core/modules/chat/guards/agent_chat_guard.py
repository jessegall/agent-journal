from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.chat.models.chat_mark import ChatMark
from core.base.change.changed import Changed
from core.base.change.deleted import Deleted
from core.base.command.context import Context


class AgentChatGuard(Guard[Changed[ChatMark]]):
    """A mark for an agent is shown in the chat of the environment that agent works in, and in no other."""

    name = "chat.agent-chat"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, event: Changed[ChatMark], context: Context) -> None:
        if isinstance(event, Deleted):
            return
        mark = event.row
        if mark.agent_id is None:
            return
        if not self.queries.query(Agent).filter(id=mark.agent_id).exists():
            raise Refusal(f"agent {mark.agent_id} works in another environment than the mark's", "a mark for an agent is shown in its own environment's chat")
