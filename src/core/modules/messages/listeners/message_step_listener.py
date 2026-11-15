from collections.abc import Sequence

from engine.event.created import Created
from engine.agent_machine.contracts.agent_listener import AgentListener
from core.modules.messages.models.message import Message


class MessageStepListener(AgentListener[Created[Message]]):
    """A message to an agent asks for that agent's step in the write that saved it, so a resting agent hears of it
    even when the server stops right after (doc 1310 section 6.2)."""

    name = "messages.message-step"

    def agents(self, event: Created[Message]) -> Sequence[int]:
        target = event.row.target_agent_id
        return tuple([target]) if target is not None else ()
