from dataclasses import dataclass
from core.base.command.command import Command
from core.modules.plans.models.phase import Phase


@dataclass(frozen=True)
class MovePhase(Command[Phase]):
    """Moves a phase to another place in its plan; the phases between shift by one."""

    phase_id: int
    position: int
