from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RecordFailedDecision(Command[None]):
    """Records that judging one task failed, with the reason, so the task stays free and shows why."""

    task_id: int
    reason: str
