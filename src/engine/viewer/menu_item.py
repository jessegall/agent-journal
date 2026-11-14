from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class MenuItem:
    """One entry of a window's search menu: a title, a line under it, and either the entries of the menu it
    opens or the key that a click on it sends to the window."""

    title: str
    subtext: str = ""
    next: Sequence["MenuItem"] = ()
    click: str | None = None

    def listed(self) -> Mapping[str, object]:
        return {"title": self.title, "subtext": self.subtext, "next": [item.listed() for item in self.next], "click": self.click}

    def problems(self, window: str) -> list[str]:
        problems = [f"{window} has a search menu entry with no title"] if not self.title else []
        if self.next and self.click:
            problems.append(f"{window} has the search menu entry {self.title}, which both opens a menu and sends a click")
        if not self.next and not self.click:
            problems.append(f"{window} has the search menu entry {self.title}, which opens no menu and sends no click")
        return problems + [problem for item in self.next for problem in item.problems(window)]
