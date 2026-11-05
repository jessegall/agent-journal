from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class AgentMove:
    """One thing an agent did lately: when, in words, whether it went well, and the row it leads to."""

    time: str
    text: str
    tone: str
    table: str
    row_id: int

    def json(self) -> Mapping[str, object]:
        return {"time": self.time, "text": self.text, "tone": self.tone, "table": self.table, "id": self.row_id}
