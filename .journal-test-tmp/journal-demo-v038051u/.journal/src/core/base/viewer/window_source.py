from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class WindowSource:
    """A named row feed supplied to a window by an installed module."""

    key: str
    read: str
    events: Sequence[str] = ()

    def listed(self) -> Mapping[str, object]:
        return {"key": self.key, "read": self.read, "events": list(self.events)}
