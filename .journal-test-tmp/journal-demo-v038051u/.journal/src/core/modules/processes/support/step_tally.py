import re
from dataclasses import dataclass


@dataclass(frozen=True)
class StepTally:
    """Counts passed and failed tests from symbols or named pattern groups."""

    passed: int = 0
    failed: int = 0

    @classmethod
    def counted(cls, step: str, progress: str, text: str) -> "StepTally":
        if not step:
            return cls()
        step_pattern, progress_pattern = re.compile(step), re.compile(progress) if progress else None
        if {"passed", "failed"} <= step_pattern.groupindex.keys():
            matches = tuple(step_pattern.finditer(text))
            return cls(sum(bool(match.group("passed")) for match in matches),
                       sum(bool(match.group("failed")) for match in matches))
        symbols = "".join(cls.row_symbols(line, step_pattern, progress_pattern) for line in text.splitlines())
        return cls(symbols.count("."), symbols.count("F") + symbols.count("E"))

    @staticmethod
    def row_symbols(line: str, step: re.Pattern[str], progress: re.Pattern[str] | None) -> str:
        matches = progress.search(line) if progress else None
        tokens = (line[:matches.start()] if matches else line).split()
        return tokens[-1] if tokens and all(step.fullmatch(symbol) for symbol in tokens[-1]) else ""
