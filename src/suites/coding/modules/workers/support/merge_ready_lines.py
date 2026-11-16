from engine.cli.row_numbers import RowNumbers
from engine.driver.agent_message import AgentMessage
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.agent_messages.worker_committed_message import WorkerCommittedMessage
from suites.coding.modules.workers.agent_messages.worker_tests_passed_message import WorkerTestsPassedMessage


class MergeReadyLines:
    """The line that says a worktree can be merged: its tests passed, or, in a started plan, its work is
    committed and its tests run at a checkpoint of the plan."""

    def __init__(self, numbers: RowNumbers) -> None:
        self.numbers = numbers

    def agent_message(self, worktree: Worktree) -> AgentMessage:
        declaration = WorkerCommittedMessage.declared() if worktree.tests_passed_at is None else WorkerTestsPassedMessage.declared()
        return declaration.agent_message(worker=self.numbers.agent_number(worktree.session_agent_id))
