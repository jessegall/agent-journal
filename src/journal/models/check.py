from dataclasses import dataclass
from datetime import datetime

from journal.models.model import Model


@dataclass(frozen=True)
class Check(Model):
    """A script that passes or fails about the project, run by hand or every so many minutes."""

    title: str = ""
    brief: str = ""
    """What it checks and what its failure means, in a few lines."""
    command: str = ""
    every: int = 0
    """Minutes between runs; 0 runs it only by hand."""
    last_passed: bool | None = None
    last_output: str = ""
    last_ran_at: datetime | None = None

    def ran(self, passed: bool, output: str, at: datetime) -> "Check":
        return self.with_(last_passed=passed, last_output=output, last_ran_at=at)

    def due_at(self, now: datetime) -> bool:
        return self.every > 0 and (self.last_ran_at is None or (now - self.last_ran_at).total_seconds() >= self.every * 60)
