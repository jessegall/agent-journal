from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.plans.phase import Phase
from core.modules.plans.phase_task import PhaseTask


@dataclass(frozen=True)
class PhaseMake(Command[Phase]):
    """Adds a phase at the end of a plan."""

    plan_id: int
    title: str
    goal: str = ""
    checkpoint: bool = False


@dataclass(frozen=True)
class PhaseMove(Command[Phase]):
    """Moves a phase to another place in its plan; the phases between shift by one."""

    phase_id: int
    position: int


@dataclass(frozen=True)
class PhasePlace(Command[PhaseTask]):
    """Places a task at the end of a phase, taking it out of the phase it was in."""

    task_id: int
    phase_id: int
