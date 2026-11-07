from collections.abc import Sequence
from dataclasses import dataclass

from core.base.viewer.window_search_entry import WindowSearchEntry


@dataclass(frozen=True)
class WindowReadSearch:
    """A search over a window's declared read command, with the fields used to match its listed values."""

    read: str
    placeholder: str
    fields: Sequence[str] = ()

    def listed(self) -> WindowSearchEntry:
        return WindowSearchEntry(read=self.read, fields=self.fields, placeholder=self.placeholder, context=[], button={})

    def problems(self, window: str) -> list[str]:
        return [f"{window} declares a search with no {name}" for name, value in (("read", self.read), ("placeholder", self.placeholder)) if not value]
