from dataclasses import dataclass

from engine.command.command import Command
from suites.coding.modules.workers.support.returned_tasks import ReturnedTasks


@dataclass(frozen=True)
class ReturnCheckpointTasks(Command[tuple[ReturnedTasks, ...]]):
    """Opens again the completed tasks a failed checkpoint run belongs to, and says which worker gets which
    of them back."""

    reach_id: int
