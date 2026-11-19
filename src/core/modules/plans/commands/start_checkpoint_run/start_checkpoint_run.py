from dataclasses import dataclass

from engine.command.command import Command
from core.modules.plans.support.checkpoint_preparation import CheckpointPreparation


@dataclass(frozen=True)
class StartCheckpointRun(Command[None]):
    """Starts the tests of the oldest reached checkpoint of a plan whose run has not ended, with what was decided
    and made for it before this write. A newer reach of the plan waits for it: one run of a plan goes at a time."""

    preparation: CheckpointPreparation
