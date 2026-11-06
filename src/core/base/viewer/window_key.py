from collections.abc import Mapping, Sequence
from dataclasses import dataclass, replace

ID_KEY_SUFFIX = ".*"
ID_PLACE = "{id}"


@dataclass(frozen=True)
class WindowKey:
    """A named part of a window's data: the read line that fills it, the tab it belongs to if any, the events and
    the timer that reload it on its own, and the names in the window's state it takes as flags of its line. A key
    named dock.* stands for one key per id, such as dock.12, and {id} in its line is that id."""

    name: str
    read: str
    tab: str | None = None
    events: Sequence[str] = ()
    reload_seconds: int = 0
    arguments: Sequence[str] = ()

    def listed(self) -> Mapping[str, object]:
        return {"tab": self.tab, "events": list(self.events), "reload_seconds": self.reload_seconds}

    @property
    def has_ids(self) -> bool:
        return self.name.endswith(ID_KEY_SUFFIX)

    @property
    def read_line(self) -> str:
        return self.read.replace(f" {ID_PLACE}", "")

    def of_id(self, name: str) -> "WindowKey | None":
        row_id = name.removeprefix(self.name.removesuffix("*"))
        if not self.has_ids or row_id == name or not row_id.isdigit():
            return None
        return replace(self, name=name, read=self.read.replace(ID_PLACE, row_id))

    def shown_on(self, tab: str) -> bool:
        return not self.has_ids and (self.tab is None or self.tab == tab)

    def line(self, state: Mapping[str, str]) -> list[str]:
        line_words = self.read.split()
        for flag_name in self.arguments:
            flag_value = state.get(f"{self.name}.{flag_name}", state.get(flag_name))
            if flag_value is not None:
                line_words += [f"--{flag_name}", flag_value]
        return line_words
