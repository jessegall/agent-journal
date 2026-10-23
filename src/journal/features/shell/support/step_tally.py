import re
from dataclasses import dataclass


@dataclass(frozen=True)
class StepTally:
    """The tests a run's step symbols count, read from its rows of symbols alone: a dot passed, an F or an E failed; a row may lead with its file and end with its progress."""

    passed: int
    failed: int

    @classmethod
    def counted(cls, step: str, progress: str, lines: list[str]) -> "StepTally":
        if not step:
            return cls(0, 0)
        symbols = "".join(cls.row_symbols(line, re.compile(step), progress) for line in lines)
        return cls(symbols.count("."), symbols.count("F") + symbols.count("E"))

    @staticmethod
    def row_symbols(line: str, step: re.Pattern, progress: str) -> str:
        row_progress = re.search(progress, line) if progress else None
        tokens = (line[:row_progress.start()] if row_progress else line).split()
        return tokens[-1] if tokens and all(step.fullmatch(symbol) for symbol in tokens[-1]) else ""

    def is_known(self) -> bool:
        return self.passed + self.failed > 0

    def text(self) -> str:
        return f"{self.passed} passed, {self.failed} failed" if self.failed else f"{self.passed} passed"
