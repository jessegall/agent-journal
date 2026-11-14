from dataclasses import dataclass

from engine.command.move_command import MoveCommand
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.plans.models.lifecycles.checkpoint_lifecycle import CheckpointLifecycle


@dataclass(frozen=True)
class FailCheckpoint(MoveCommand[CheckpointReach]):
    """Ends the run of a reached checkpoint as failed, with the tasks its failures belong to."""

    move = CheckpointLifecycle.failed
    failed_task_ids: str = ""
