from dataclasses import dataclass, replace
from typing import ClassVar

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class TurnWritten(AgentEvent):
    """The agent wrote a turn for the user: the text so far, the part that just came, and whether that part was the last. What reaches the chat and what the tags are read from is the whole, on the final one."""

    carries_lines: ClassVar[bool] = False
    text: str
    delta: str = ""
    turn_id: str = ""
    index: int = 0
    final: bool = True

    @property
    def words(self) -> str:
        return self.text if self.final else ""

    def with_text(self, whole: str) -> "TurnWritten":
        return replace(self, text=whole)

    def with_final(self, final: bool) -> "TurnWritten":
        return replace(self, final=final)
