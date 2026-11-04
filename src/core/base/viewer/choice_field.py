from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from typing import Any

from core.base.viewer.choice import Choice


@dataclass(frozen=True)
class ChoiceField:
    """A button field whose value is picked from a fixed list."""

    name: str
    label: str
    choices: Sequence[Choice]
    default: str = ""

    @classmethod
    def restored(cls, stored: Mapping[str, Any]) -> "ChoiceField":
        return cls(stored["name"], stored["label"], tuple(Choice(**choice) for choice in stored["choices"]),
                   stored.get("default", ""))
