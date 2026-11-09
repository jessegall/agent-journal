from datetime import timedelta

from core.base.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.queries.worker_operation_query import WorkerOperationQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery

OPERATION_END_SECONDS = 10


class WorkerHandoff:
    """Whether a worker ended while its hand-in is under way: a command of its own runs or has just ended,
    or its delivered task waits for a proof check or a merge."""

    def __init__(self, operations: WorkerOperationQuery, worktrees: WorktreeQuery) -> None:
        self.operations, self.worktrees = operations, worktrees

    def is_pending(self, worker: Agent) -> bool:
        if self.operations.active(worker.id) is not None:
            return True
        if worker.ended_at is not None and self.operations.ended_after(worker.id, Timestamp(worker.ended_at.value - timedelta(seconds=OPERATION_END_SECONDS))):
            return True
        worktree = self.worktrees.worker_worktree(worker.id)
        return worktree is not None and worktree.state is WorktreeState.DELIVERED
