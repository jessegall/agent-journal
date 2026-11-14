from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RecordCheckpoints(Command[None]):
    """Looks at every checkpoint of a plan: a window that is reached gets a reach for its run, or a pass when
    it has nothing to run; with passes_only it records only the passes and starts no run."""

    plan_id: int
    passes_only: bool = False
