from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.driver.nudge import Nudge
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.nudges.worker_committed_nudge import WorkerCommittedNudge
from suites.coding.modules.workers.nudges.worker_tests_passed_nudge import WorkerTestsPassedNudge


class MergeReadyLines:
    """The line that says a worktree can be merged: its tests passed, or, in a started plan, its work is
    committed and its tests run at a checkpoint of the plan."""

    def __init__(self, numbers: RowNumbers) -> None:
        self.numbers = numbers

    def nudge(self, worktree: Worktree) -> Nudge:
        declaration = WorkerCommittedNudge.declared() if worktree.tests_passed_at is None else WorkerTestsPassedNudge.declared()
        return declaration.nudge(worker=self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id))
