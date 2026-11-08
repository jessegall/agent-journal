import re
from dataclasses import dataclass

LOOKED_AT_CHARACTERS = 1 << 20


@dataclass(frozen=True)
class RunShape:
    """The line shape in a run's output that a reader counts for progress, the reader flag and pattern that count
    it, and whether the output states a total."""

    label: str
    found: re.Pattern[str]
    flag: str
    pattern: str
    states_total: bool
    count: str = ""

    @property
    def total_note(self) -> str:
        return "states its total" if self.states_total else "states no total, so the command must print one first"

    def reader_options(self) -> str:
        count = f' --count "{self.count}"' if self.count else ""
        return f'--lines "{self.found.pattern}" --summary "(?i)passed|failed|done" --{self.flag} "{self.pattern}"{count}'


SHAPES = (
    RunShape("--- PASS:/--- FAIL:", re.compile(r"(?m)^\s*--- (?:PASS|FAIL):"), "step", r"(?m)^\s*--- (?:(?P<passed>PASS)|(?P<failed>FAIL)):", False),
    RunShape("PASSED/FAILED", re.compile(r"\b(?:PASSED|FAILED)\b"), "step", r"\b(?:(?P<passed>PASSED)|(?P<failed>FAILED))\b", False),
    RunShape("reading n/m", re.compile(r"(?i)reading \d+/\d+"), "progress", r"(?i)reading (\d+)/(\d+)", True, r"(?i)reading \d+/(\d+)"),
    RunShape("n of m", re.compile(r"\b\d+ of \d+\b"), "progress", r"(\d+) of (\d+)", True, r"\d+ of (\d+)"),
    RunShape("n/m", re.compile(r"\b\d+/\d+\b"), "progress", r"(\d+)/(\d+)", True, r"\d+/(\d+)"),
)


class RunShapes:
    """Finds the first of the known line shapes in a run's output."""

    @staticmethod
    def found(output: str) -> RunShape | None:
        text = output[:LOOKED_AT_CHARACTERS]
        return next((shape for shape in SHAPES if shape.found.search(text)), None)
