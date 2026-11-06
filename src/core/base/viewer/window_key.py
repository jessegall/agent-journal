from collections.abc import Mapping, Sequence
from dataclasses import dataclass, replace

from core.base.viewer.key_loading import KeyLoading

ID_KEY_SUFFIX = ".*"
ID_PLACE = "{id}"


@dataclass(frozen=True)
class WindowKey:
    """A named part of a window's data, a prop of the window: the read line that fills it, the tab it
    belongs to if any, the events and the timer that reload it on its own, and the names in the window's
    state it takes as flags of its line. A page_size makes it a list read a page at a time, and an argument
    ids lets it read the rows with given ids together. A key named run.* is one key per id, such as run.12,
    with {id} in its line, and answered_line means its read answers the line and window that fill it."""

    name: str
    read: str
    tab: str | None = None
    events: Sequence[str] = ()
    reload_seconds: int = 0
    arguments: Sequence[str] = ()
    loading: KeyLoading = KeyLoading.FIRST
    page_size: int = 0
    answered_line: bool = False

    def listed(self) -> Mapping[str, object]:
        return {"tab": self.tab, "events": list(self.events), "reload_seconds": self.reload_seconds, "loading": self.loading,
                "page_size": self.page_size, "reads_ids": "ids" in self.arguments}

    @property
    def has_ids(self) -> bool:
        return self.name.endswith(ID_KEY_SUFFIX)

    def with_id(self, name: str) -> "WindowKey | None":
        prefix = self.name.removesuffix("*")
        row_id = name.removeprefix(prefix)
        if not self.has_ids or row_id == name or not row_id.isdigit():
            return None
        return replace(self, name=name, read=self.read.replace(ID_PLACE, row_id))

    def loads_first(self, tab: str) -> bool:
        return not self.has_ids and self.loading == KeyLoading.FIRST and (self.tab is None or self.tab == tab)

    def line(self, state: Mapping[str, str]) -> list[str]:
        line = self.read.split()
        for flag_name in self.arguments:
            flag_value = state.get(f"{self.name}.{flag_name}", state.get(flag_name))
            if flag_value is not None:
                line += [f"--{flag_name}", flag_value]
        if self.page_size and "--limit" not in line:
            line += ["--limit", str(self.page_size)]
        return line
