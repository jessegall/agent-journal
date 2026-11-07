from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class WindowKeyLine:
    """The line that fills a key whose line depends on a row, and the window whose rights it runs with."""

    window: str
    line: Sequence[str]

    @classmethod
    def create(cls, value: Mapping[str, object]) -> "WindowKeyLine":
        return cls(str(value["window"]), [str(word) for word in value["line"]])

    def json(self) -> Mapping[str, object]:
        return {"window": self.window, "line": list(self.line)}
