from dataclasses import dataclass
from datetime import datetime

from journal.events.agent.agent_event import AgentEvent
from journal.models.message import Message


@dataclass(frozen=True)
class PeerMessage(AgentEvent):
    """Another session's agent sent the agent a message, read from the agent's transcript: who sent it, by the name it goes by, and its words; it asks for an answer when its last line is a question."""

    sender: str
    text: str

    def message(self, time: datetime) -> Message:
        return Message.agent_message(self.sender, self.text, self.session, time, self.is_question())

    def is_question(self) -> bool:
        lines = [line for line in self.text.strip().splitlines() if line.strip()]
        return bool(lines) and lines[-1].rstrip().endswith("?")
