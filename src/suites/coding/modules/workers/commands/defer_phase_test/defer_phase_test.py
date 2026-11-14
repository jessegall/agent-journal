from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class DeferPhaseTest(Command[str]):
    """A merger leaves failing test paths out of the own test of the checkpoint a worker's returned task
    belongs to, until the next checkpoint of the plan."""

    worker_id: int
    paths: tuple[str, ...]
    reason: str
    line_id: int | None = None
