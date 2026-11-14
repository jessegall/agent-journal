from dataclasses import dataclass


@dataclass(frozen=True, order=True)
class MarkdownFault:
    """One place in a text that does not draw as written: its line number and what is wrong there."""

    line: int
    problem: str

    def __str__(self) -> str:
        return f"line {self.line}: {self.problem}"
