from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class ProjectFileText:
    """One file of an environment's checkout, its text, and whether the text was cut at the size a window
    shows."""

    path: str
    text: str
    cut: bool

    def json(self) -> Mapping[str, object]:
        return {"path": self.path, "text": self.text, "cut": self.cut}
