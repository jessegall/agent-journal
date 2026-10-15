from dataclasses import dataclass, replace

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class TurnWritten(AgentEvent):
    """The agent wrote a turn for the user: the text so far, the part that just came, and whether that part was the last. What reaches the chat and what the tags are read from is the whole, on the final one."""

    text: str
    delta: str = ""
    turn_id: str = ""
    final: bool = True

    def with_text(self, whole: str) -> "TurnWritten":
        return replace(self, text=whole)
