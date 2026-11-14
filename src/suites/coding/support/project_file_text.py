from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class ProjectFileText:
    """One file of an environment's checkout, its text, whether the text was cut at the size a window
    shows, its git letter and, for a moved file, the path it was moved from."""

    path: str
    text: str
    cut: bool
    git: str = ""
    moved_from: str = ""

    def json(self) -> Mapping[str, object]:
        return {"path": self.path, "text": self.text, "cut": self.cut, "git": self.git, "moved_from": self.moved_from}
