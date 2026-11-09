import re
from core.modules.processes.support.run_shape import RunShape

INSPECTED_CHARACTERS = 1 << 20
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
        text = output[:INSPECTED_CHARACTERS]
        return next((shape for shape in SHAPES if shape.found.search(text)), None)
