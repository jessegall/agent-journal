from dataclasses import dataclass

from engine.command.command import Command
from suites.coding.modules.workers.support.returned_tasks import ReturnedTasks


@dataclass(frozen=True)
class ReportReturnedTasks(Command[None]):
    """Tells a worker which tests of a checkpoint failed for the tasks it got back, and moves the proofs of
    those tasks to the worktree it now works in."""

    phase_id: int
    returned: ReturnedTasks
