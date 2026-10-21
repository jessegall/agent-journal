import re
from dataclasses import dataclass

PERCENT = 100


@dataclass(frozen=True)
class Progress:
    """How far a command has come by its output: a count of a total, a percentage being a count of a hundred, with the reader's words in front."""

    count: int
    total: int
    label: str = ""

    @classmethod
    def empty(cls) -> "Progress":
        return cls(0, 0)

    @classmethod
    def found(cls, pattern: str, label: str, lines: list[str]) -> "Progress":
        if not pattern:
            return cls.empty()
        rows = re.compile(pattern)
        matches = [match for line in lines if (match := rows.search(line))]
        if not matches:
            return cls.empty()
        figures = [int(figure) for figure in matches[-1].groups() if figure is not None]
        return cls(figures[0], figures[1] if len(figures) > 1 else PERCENT, label)

    def is_known(self) -> bool:
        return self.total > 0

    def fraction(self) -> float:
        return min(self.count / self.total, 1.0) if self.is_known() else 0.0

    def text(self) -> str:
        figure = f"{self.count}%" if self.total == PERCENT else f"{self.count}/{self.total}"
        return f"{self.label} {figure}".strip()
