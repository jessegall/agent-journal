from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class NudgeEntry:
    """A registered nudge: its key and the module that declares it, its type, its words and its limits."""

    key: str
    module: str
    type: str
    text: str
    repeat_seconds: int
    longest_characters: int

    @classmethod
    def restored(cls, stored: Mapping[str, Any]) -> "NudgeEntry":
        return cls(stored["key"], stored["module"], stored["type"], stored["text"], stored["repeat_seconds"], stored["longest_characters"])
