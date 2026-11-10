from dataclasses import dataclass

from core.base.timestamp import Timestamp


@dataclass(frozen=True)
class ScriptSkip:
    """The newest time a plugin's script was left out, and why."""

    reason: str
    skipped_at: Timestamp
