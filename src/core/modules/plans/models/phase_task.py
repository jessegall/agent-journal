from dataclasses import dataclass

from engine.model.assignment_link import AssignmentLink
from engine.model.positioned import Positioned


@dataclass(frozen=True, kw_only=True)
class PhaseTask(Positioned, AssignmentLink):
    """A task's place in a phase; a task has at most one. Placing a task in an assigned phase gives it the phase's
    actor, and taking it out takes away what it inherited from the phase."""

    model_name = "phase_task"
    cli_name = "phase-task"

    phase_id: int
    task_id: int
    creator_id: int
    position: int
