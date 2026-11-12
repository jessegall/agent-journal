from collections.abc import Callable

from engine.cli.row_numbers import RowNumbers
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from core.modules.agents.support.agent_label import AgentLabel
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.worktree_behind_check import WorktreeBehindCheck
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery

CHECKS_REASON = "every behind check of the worktree is weighed"
NO_OPEN_CHECK = "no open check for this worker"


class BehindDecisions:
    """Finds the check of a worker that waits for a decision: its worktree in this environment and its open check,
    or one the merger passed; anything else is refused by name."""

    def __init__(self, worktrees: WorktreeQuery, queries: Queries, numbers: RowNumbers) -> None:
        self.worktrees, self.queries, self.numbers = worktrees, queries, numbers

    def decidable(self, worker_id: int) -> tuple[Worktree, WorktreeBehindCheck]:
        return self.found(worker_id, WorktreeBehindCheck.open_for_decision)

    def passable(self, worker_id: int) -> tuple[Worktree, WorktreeBehindCheck]:
        return self.found(worker_id, WorktreeBehindCheck.may_be_passed)

    def found(self, worker_id: int, wanted: Callable[[WorktreeBehindCheck], bool]) -> tuple[Worktree, WorktreeBehindCheck]:
        worktree = self.worktree(worker_id)
        check = self.check(worktree, wanted)
        if check is None:
            raise Refusal(NO_OPEN_CHECK, "journal merger behind <worker> shows how far it is behind")
        return worktree, check

    def worktree(self, worker_id: int) -> Worktree:
        worktree = self.worktrees.worker_worktree(worker_id)
        if worktree is None:
            raise Refusal(f"no {AgentLabel.from_row_id(worker_id, self.numbers, 'worker').text} with a worktree in this environment")
        return worktree

    def check(self, worktree: Worktree, wanted: Callable[[WorktreeBehindCheck], bool]) -> WorktreeBehindCheck | None:
        return next((row for row in reversed(tuple(self.queries.query(WorktreeBehindCheck).filter(worktree_id=worktree.id).every_row(CHECKS_REASON))) if wanted(row)), None)
