from engine.command.context import Context
from engine.query.queries import Queries
from engine.repository.repository import Repository
from suites.coding.modules.workers.models.enums.merge_ask_state import MergeAskState
from suites.coding.modules.workers.models.lifecycles.merge_ask_lifecycle import MergeAskLifecycle
from suites.coding.modules.workers.models.merge_ask import MergeAsk
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worktree_git import WorktreeGit

WAITING_ASKS_REASON = "the waiting merge asks of one worktree, one or two"


class MergedAsks:
    """A worker's merge ask is merged once its commit is on the base branch, however it got there: by the merger,
    by the main agent's merge up to a later task, or by hand."""

    def __init__(self, queries: Queries, repository: Repository, git: WorktreeGit) -> None:
        self.queries, self.repository, self.git = queries, repository, git

    def waiting(self, worktree: Worktree) -> MergeAsk | None:
        return next((ask for ask in self.waiting_asks(worktree) if not self.is_merged(worktree, ask)), None)

    def close(self, worktree: Worktree, context: Context) -> None:
        for ask in self.waiting_asks(worktree):
            if self.is_merged(worktree, ask):
                self.repository.save_change(ask, ask.moved(MergeAskLifecycle.merge), context)

    def waiting_asks(self, worktree: Worktree) -> list[MergeAsk]:
        return list(self.queries.query(MergeAsk).filter(worktree_id=worktree.id, state=MergeAskState.WAITING).every_row(WAITING_ASKS_REASON))

    def is_merged(self, worktree: Worktree, ask: MergeAsk) -> bool:
        return self.git.is_ancestor(worktree.folder, ask.commit_id, worktree.base_branch)
