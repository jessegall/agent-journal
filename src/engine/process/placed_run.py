from dataclasses import dataclass

from engine.process.execution_request import ExecutionRequest


@dataclass(frozen=True)
class PlacedRun:
    """A run admitted by the queue: its request, its process row, if one was made, and whether it holds a place."""

    request: ExecutionRequest
    process_id: int | None
    holds_place: bool
