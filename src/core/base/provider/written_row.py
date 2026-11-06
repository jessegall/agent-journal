from dataclasses import dataclass

from core.base.timestamp import Timestamp


@dataclass(frozen=True)
class WrittenRow:
    """A text the agent wrote or a prompt a person typed, as the session file keeps it, with when it was written."""

    is_prompt: bool
    text: str
    written_at: Timestamp
