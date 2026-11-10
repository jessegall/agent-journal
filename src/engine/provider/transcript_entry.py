from dataclasses import dataclass

from engine.time.timestamp import Timestamp


@dataclass(frozen=True)
class TranscriptEntry:
    """A message or prompt read from a session transcript."""

    is_prompt: bool
    text: str
    created_at: Timestamp
