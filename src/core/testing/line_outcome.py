from dataclasses import dataclass


@dataclass(frozen=True)
class LineOutcome:
    """What one command line gave back: its exit code and what it printed."""

    line: str
    code: int
    output_text: str
