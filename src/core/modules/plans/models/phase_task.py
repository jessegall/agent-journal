from dataclasses import dataclass

from engine.model.positioned import Positioned


@dataclass(frozen=True, kw_only=True)
class PhaseTask(Positioned):
    """A task's place in a phase; a task has at most one."""

    model_name = "phase_task"
    cli_name = "phase-task"

    phase_id: int
    task_id: int
    creator_id: int
    position: int
