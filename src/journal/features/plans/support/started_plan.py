from dataclasses import dataclass


@dataclass(frozen=True)
class StartedPlan:
    """The plan started here as the plans feature reads it: the task it would start next, the task of it in hand with its briefing, its tasks, how many are left and whether it stands at a checkpoint."""

    plan_id: int
    next_task: int
    started_task: int
    started_task_briefing: str
    tasks: tuple[int, ...]
    tasks_left: int
    at_checkpoint: bool
    checkpoint_phase: int
