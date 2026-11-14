from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.chat.models.chat_mark import ChatMark
from engine.event.changed import Changed
from engine.event.deleted import Deleted
from engine.command.context import Context


class AgentChatGuard(Guard[Changed[ChatMark]]):
    """A mark for an agent is shown in the chat of the environment that agent works in, and in no other."""

    name = "chat.agent-chat"

    def __init__(self, agents: AgentRows) -> None:
        self.agents = agents

    def check(self, event: Changed[ChatMark], context: Context) -> None:
        if isinstance(event, Deleted):
            return
        mark = event.row
        if mark.session_agent_id is None:
            return
        if not self.agents.is_visible(mark.session_agent_id):
            raise Refusal("the agent of this mark works in another environment than the mark's", "a mark for an agent is shown in its own environment's chat")
