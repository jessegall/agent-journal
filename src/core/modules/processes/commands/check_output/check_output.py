from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.processes.models.watch import Watch


@dataclass(frozen=True)
class CheckOutput(Command[Watch]):
    """Wakes the agent watching a run, when its next wake is due and the run still goes, to confirm the run does its work."""

    watch_id: int
