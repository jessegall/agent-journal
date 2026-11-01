from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class NudgeRow:
    """One declared nudge as the nudges window lists it: what it is, and how often it was said."""

    key: str
    module: str
    type: str
    text: str
    repeat_seconds: int
    said_count: int
    last_said_at: str

    def json(self) -> Mapping[str, object]:
        return {"id": self.key, "key": self.key, "module": self.module, "type": self.type, "text": self.text, "repeat_seconds": self.repeat_seconds, "said_count": self.said_count, "last_said_at": self.last_said_at}
