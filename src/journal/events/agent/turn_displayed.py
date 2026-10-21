from dataclasses import dataclass, replace
from typing import ClassVar

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class TurnDisplayed(AgentEvent):
    """The agent wrote a turn for the user: the text so far, the part that just came, and whether that part was the last. What reaches the chat and what the tags are read from is the whole, on the final one."""

    has_lines: ClassVar[bool] = False
    text: str
    delta: str = ""
    turn_id: str = ""
    index: int = 0
    final: bool = True

    @property
    def content(self) -> str:
        return self.text if self.final else ""

    def with_text(self, full: str) -> "TurnDisplayed":
        return replace(self, text=full)

    def with_final(self, final: bool) -> "TurnDisplayed":
        return replace(self, final=final)
