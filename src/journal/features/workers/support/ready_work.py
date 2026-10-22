from dataclasses import dataclass


@dataclass(frozen=True)
class ReadyWork:
    """A clocked-out worker's work waiting for the main agent's check: the worker, by number and name, and the task it holds."""

    worker: int
    name: str
    task: int
