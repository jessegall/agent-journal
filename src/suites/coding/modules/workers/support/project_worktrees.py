from collections import Counter
from pathlib import Path

from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.environments.models.environment import Environment
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.project_worktree import ProjectWorktree
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class ProjectWorktrees:
    """The worktrees of the repository an environment is in, each with who holds it."""

    def __init__(self, queries: Queries, worktrees: WorktreeQuery, git: WorktreeGit) -> None:
        self.queries, self.worktrees, self.git = queries, worktrees, git

    def folder(self, environment_id: int | None) -> str:
        if environment_id is None:
            raise Refusal("a repository is read in one environment", "run this from an environment")
        return self.queries.query(Environment).find(environment_id).folder

    def listed(self, environment_id: int | None) -> list[ProjectWorktree]:
        environments = {str(Path(row.folder).resolve()): row for row in self.queries.query(Environment).all_rows()}
        workers = {str(Path(row.folder).resolve()): row.agent_id for row in self.worktrees.open_worktrees()}
        running = Counter(agent.environment_id for agent in self.queries.query(Agent).matching(IsNull("ended_at")).all_rows())
        folders = self.git.folders(self.folder(environment_id))
        return [self.worktree(folder, branch, not index, environments.get(str(Path(folder).resolve())), workers.get(str(Path(folder).resolve())), running)
                for index, (folder, branch) in enumerate(folders)]

    def worktree(self, folder: str, branch: str | None, is_checkout: bool, environment: Environment | None, worker_id: int | None, running: Counter[int]) -> ProjectWorktree:
        agent_count = running[environment.id] if environment else 0
        return ProjectWorktree(folder, branch, is_checkout, environment.name if environment else None, worker_id, agent_count)
