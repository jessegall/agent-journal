from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RecordCheckpoints(Command[None]):
    """Looks at every checkpoint of a plan: a window that is reached gets a reach for its run, or a pass when
    it has nothing to run."""

    plan_id: int
