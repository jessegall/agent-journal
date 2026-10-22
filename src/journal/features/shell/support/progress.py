import re
from dataclasses import dataclass

PERCENT = 100


@dataclass(frozen=True)
class Progress:
    """How far a command has come by its output: a count of a total, a percentage being a count of a hundred, with the reader's words in front; with a step pattern, each step printed since the last count adds its share of the row before it, so a run that prints its percentage once a row moves with every step."""

    count: int
    total: int
    label: str = ""

    @classmethod
    def empty(cls) -> "Progress":
        return cls(0, 0)

    @classmethod
    def found(cls, pattern: str, label: str, lines: list[str], step: str) -> "Progress":
        if not pattern:
            return cls.empty()
        rows = re.compile(pattern)
        hits = [(number, match) for number, line in enumerate(lines) if (match := rows.search(line))]
        if not hits:
            return cls.empty()
        figures = cls.figures(hits[-1][1])
        total = figures[1] if len(figures) > 1 else PERCENT
        stepped = cls.stepped(re.compile(step), lines, hits) if step else 0.0
        return cls(min(int(figures[0] + stepped), total), total, label)

    @staticmethod
    def figures(match: re.Match) -> list[int]:
        return [int(figure) for figure in match.groups() if figure is not None]

    @classmethod
    def stepped(cls, step_pattern: re.Pattern, lines: list[str], hits: list[tuple[int, re.Match]]) -> float:
        row_number, row_match = hits[-1]
        row_steps = len(step_pattern.findall(lines[row_number][:row_match.start()]))
        if not row_steps:
            return 0.0
        previous_count = cls.figures(hits[-2][1])[0] if len(hits) > 1 else 0
        later_steps = sum(len(step_pattern.findall(line)) for line in lines[row_number + 1:])
        return later_steps * (cls.figures(row_match)[0] - previous_count) / row_steps

    def is_known(self) -> bool:
        return self.total > 0

    def fraction(self) -> float:
        return min(self.count / self.total, 1.0) if self.is_known() else 0.0

    def text(self) -> str:
        return f"{self.label} {self.count_text()}".strip()

    def count_text(self) -> str:
        return f"{self.count}%" if self.total == PERCENT else f"{self.count}/{self.total}"
