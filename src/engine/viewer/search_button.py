from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class SearchButton:
    """A button that stands beside a window's search field, such as Manage tasks: its title and the key that a
    click sends to the window."""

    title: str
    click: str

    def listed(self) -> Mapping[str, str]:
        return {"title": self.title, "click": self.click}
