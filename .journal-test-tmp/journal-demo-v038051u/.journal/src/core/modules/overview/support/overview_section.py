from dataclasses import dataclass


@dataclass(frozen=True)
class OverviewSection:
    """One command of the overview and what it printed."""

    command: str
    text: str

    def lines(self) -> str:
        return f"## {self.command}\n{self.text}"
