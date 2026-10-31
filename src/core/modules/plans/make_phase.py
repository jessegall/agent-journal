from dataclasses import dataclass
from core.base.command.command import Command
from core.modules.plans.phase import Phase


@dataclass(frozen=True)
class MakePhase(Command[Phase]):
    """Adds a phase at the end of a plan."""

    plan_id: int
    title: str
    goal: str = ""
    checkpoint: bool = False
