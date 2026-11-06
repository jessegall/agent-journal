from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class WindowKey:
    """A named part of a window's data: the read line that fills it, the tab it belongs to if any, the events and
    the timer that reload it on its own, and the names in the window's state it takes as flags of its line."""

    name: str
    read: str
    tab: str = ""
    events: Sequence[str] = ()
    every_seconds: int = 0
    arguments: Sequence[str] = ()

    def listed(self) -> Mapping[str, object]:
        return {"tab": self.tab, "events": list(self.events), "every_seconds": self.every_seconds}

    def is_on_screen(self, tab: str) -> bool:
        return not self.tab or self.tab == tab

    def line(self, state: Mapping[str, str]) -> list[str]:
        words = self.read.split()
        for argument in self.arguments:
            value = state.get(f"{self.name}.{argument}", state.get(argument))
            if value is not None:
                words += [f"--{argument}", value]
        return words
