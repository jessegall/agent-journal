from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class WindowKey:
    """A named part of a window's data: the read line that fills it, the tab it belongs to if any, the events and
    the timer that reload it on its own, and the names in the window's state it takes as flags of its line."""

    name: str
    read: str
    tab: str | None = None
    events: Sequence[str] = ()
    reload_seconds: int = 0
    arguments: Sequence[str] = ()

    def listed(self) -> Mapping[str, object]:
        return {"tab": self.tab, "events": list(self.events), "reload_seconds": self.reload_seconds}

    def shown_on(self, tab: str) -> bool:
        return self.tab is None or self.tab == tab

    def line(self, state: Mapping[str, str]) -> list[str]:
        line_words = self.read.split()
        for flag_name in self.arguments:
            flag_value = state.get(f"{self.name}.{flag_name}", state.get(flag_name))
            if flag_value is not None:
                line_words += [f"--{flag_name}", flag_value]
        return line_words
