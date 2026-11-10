from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from engine.types.type_guards import is_list, is_mapping


@dataclass(frozen=True)
class WindowKeyLine:
    """The line that fills a key whose line depends on a row, and the window whose rights it runs with."""

    window: str
    line: Sequence[str]

    @classmethod
    def create(cls, value: object) -> "WindowKeyLine":
        if not is_mapping(value):
            raise TypeError(f"{value!r} is no window line")
        line = value["line"]
        if not is_list(line):
            raise TypeError(f"{line!r} is no line of words")
        return cls(str(value["window"]), [str(word) for word in line])

    def json(self) -> Mapping[str, object]:
        return {"window": self.window, "line": list(self.line)}
