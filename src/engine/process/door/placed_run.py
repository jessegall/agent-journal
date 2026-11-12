from dataclasses import dataclass

from engine.process.door.execution_request import ExecutionRequest


@dataclass(frozen=True)
class PlacedRun:
    """A run admitted by the queue: its request, its process row, if one was made, whether it holds a place, the
    agent it works for and its environment."""

    request: ExecutionRequest
    process_id: int | None
    holds_place: bool
    agent_id: int | None = None
    environment_id: int | None = None
