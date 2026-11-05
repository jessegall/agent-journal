from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class ResumeRunQueue(Command[str]):
    """Resumes a halted queue of test runs, which gives the waiting runs their spots, oldest first."""
