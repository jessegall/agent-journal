from dataclasses import dataclass


@dataclass(frozen=True)
class WorkerChoice:
    """The program and model selected for a worker, with the reason."""

    program: str
    model: str
    reason: str
