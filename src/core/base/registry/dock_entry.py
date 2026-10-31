from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class DockEntry:
    """A registered dockable item type: its type and the module that declares it, its icon, title and body
    file, the buttons on its wrapper, its limits and read lines, whether the journal ships its module, and
    why it is unavailable (empty when it is available)."""

    type: str
    module: str
    icon: str
    title: str
    body: str
    buttons: Sequence[Mapping[str, str]]
    most: int
    leaves_after_seconds: int
    reads: Sequence[str]
    shipped: bool
    unavailable_reason: str

    @classmethod
    def restored(cls, stored: Mapping[str, Any]) -> "DockEntry":
        return cls(stored["type"], stored["module"], stored["icon"], stored["title"], stored["body"], tuple(stored["buttons"]), stored["most"],
                   stored["leaves_after_seconds"], tuple(stored["reads"]), stored["shipped"], stored["unavailable_reason"])
