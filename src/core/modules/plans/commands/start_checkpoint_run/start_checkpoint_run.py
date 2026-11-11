from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class StartCheckpointRun(Command[None]):
    """Starts the tests of the oldest reached checkpoint of a plan whose run has not ended. A newer reach of
    the plan waits for it: one run of a plan goes at a time."""

    plan_id: int
