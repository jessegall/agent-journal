from dataclasses import dataclass
from core.base.command.command import Command
from core.modules.plans.models.phase_task import PhaseTask


@dataclass(frozen=True)
class PlacePhase(Command[PhaseTask]):
    """Places a task at the end of a phase, taking it out of the phase it was in."""

    task_id: int
    phase_id: int
