from dataclasses import dataclass


@dataclass(frozen=True)
class Attribution:
    """The task a failed test of a checkpoint run belongs to, and whether the failure itself points at that task."""

    task_id: int
    is_certain: bool
