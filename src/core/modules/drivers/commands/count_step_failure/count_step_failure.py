from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class CountStepFailure(Command[None]):
    """Counts a failed try of one step request, which sends it to the back of the queue."""

    request_id: int
