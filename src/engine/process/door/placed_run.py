from dataclasses import dataclass

from engine.process.door.execution_request import ExecutionRequest


@dataclass(frozen=True)
class PlacedRun:
    """A run admitted by the queue: its request, its process row, if one was made, whether it holds a place, the
    agent it works for and whether that agent was paused when it came in."""

    request: ExecutionRequest
    process_id: int | None
    holds_place: bool
    agent_id: int | None = None
    environment_id: int | None = None
    paused_at_start: bool = False
