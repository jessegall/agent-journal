from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class StartCheckpointRun(Command[None]):
    """Starts the tests of a reached checkpoint of a plan."""

    reach_id: int
