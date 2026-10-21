from dataclasses import dataclass
from datetime import datetime

from journal.events.agent.agent_event import AgentEvent
from journal.models.message import Message


@dataclass(frozen=True)
class MessageCrossed(AgentEvent):
    """Another session's agent sent the agent a message, read from the agent's transcript: who sent it, by the name it goes by, and its words."""

    sender: str
    text: str

    def message(self, time: datetime) -> Message:
        return Message.from_agent(self.sender, self.text, self.session, time)
