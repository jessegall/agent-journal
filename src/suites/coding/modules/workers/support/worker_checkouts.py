from pathlib import Path

from core.base.checkout import Checkout
from core.base.file_state import FileState
from core.base.file_status import FileStatus
from core.base.query.queries import Queries
from core.modules.agents.bindings.agent_project_checkouts import AgentProjectCheckouts
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worktree_git import WorktreeGit

HEAD = "HEAD"


class WorkerCheckouts(AgentProjectCheckouts):
    """A worker works in the newest worktree it was given, also once that is removed; an agent it started takes the
    checkout of its parent; any other agent works in the project."""

    def __init__(self, queries: Queries, worktrees: WorktreeQuery, git: WorktreeGit) -> None:
        super().__init__(queries)
        self.worktrees, self.git = worktrees, git

    def checkout(self, agent_id: int) -> Checkout:
        agent = self.queries.query(Agent).find(agent_id)
        worktree = self.worktrees.newest_worktree(agent_id)
        if worktree is not None:
            return self.worktree_checkout(worktree, agent)
        return self.checkout(agent.parent_id) if agent.parent_id is not None else super().checkout(agent_id)

    def checkout_of_file(self, agent_id: int, path: Path) -> Checkout:
        """The worktree with the longest root that holds the file, whoever wrote it; a project holds every worktree, so
        it is only the answer when none does."""
        agent = self.queries.query(Agent).find(agent_id)
        real = path.parent.resolve() / path.name
        holding = [worktree for worktree in self.worktrees.filter(environment_id=agent.environment_id).all_rows() if real.is_relative_to(Path(worktree.folder).resolve())]
        if not holding:
            return self.checkout(agent_id)
        return self.worktree_checkout(max(holding, key=lambda worktree: len(Path(worktree.folder).resolve().parts)), agent)

    def file_state(self, checkout: Checkout, relative: str) -> FileState:
        """Asks git in the project, whose store every worktree shares and which stays when a worktree is removed."""
        base = checkout.base_commit or HEAD
        folder = str(checkout.project_root)
        state = super().file_state(checkout, relative)
        if not self.git.has_commit(folder, base):
            return state
        in_base = self.git.commit_holds(folder, base, relative)
        return FileState(state.status if state.status is FileStatus.DELETED or in_base else FileStatus.ADDED, in_base)

    def worktree_checkout(self, worktree: Worktree, agent: Agent) -> Checkout:
        folder = Path(worktree.folder)
        return Checkout.of_copy(folder, Path(self.environment(agent).folder), worktree.branch, worktree.base_branch, worktree.base_commit, worktree.removed_at is None and folder.is_dir())
