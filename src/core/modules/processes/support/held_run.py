from dataclasses import dataclass

from core.modules.processes.models.process import Process


@dataclass(frozen=True)
class HeldRun:
    """A run of an agent that has printed nothing for the hang time, and what its tree's processor time does."""

    process: Process
    seconds: int
    processor: str
