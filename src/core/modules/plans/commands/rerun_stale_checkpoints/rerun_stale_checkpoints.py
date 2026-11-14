from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RerunStaleCheckpoints(Command[None]):
    """Gives a plan whose windows are all reached one new run of a window that holds a failed run from before
    its tasks last ended, or its pass when the window has no completed task."""

    plan_id: int
