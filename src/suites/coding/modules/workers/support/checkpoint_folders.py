from core.modules.agents.support.agent_rows import AgentRows
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from engine.errors.refusal import Refusal
from engine.database.kept_rows import KeptRows
from engine.query.queries import Queries
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.worktree_reach import WorktreeReach
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worktree_git import WorktreeGit

FOLDER_NAME = "plan-{plan}"


class CheckpointFolders:
    """Says where the run of a reached checkpoint tests, who owns its tests and which commit its selected run
    compares with. A worker run tests the worker's commit in the worker's test checkout, owned by the worker,
    over the files changed since its worktree was cut. A run of merged work tests the head of the environment's
    branch, owned by the worker merged last in the window, or by the main agent when no worker's work is in
    it, over the files the last merge changed."""

    def __init__(self, queries: Queries, worktrees: WorktreeQuery, git: WorktreeGit, environments: EnvironmentRows, agents: AgentRows, kept: KeptRows) -> None:
        self.queries, self.worktrees, self.git, self.kept = queries, worktrees, git, kept
        self.environments, self.agents = environments, agents

    def checkout(self, reach: CheckpointReach) -> str:
        link = self.link(reach)
        if link is not None:
            return self.git.commit_checkout(self.queries.query(Worktree).find(link.worktree_id), link.commit_id)
        return self.git.base_checkout(self.environments.find(reach.environment_id), FOLDER_NAME.format(plan=reach.plan_id))

    def owner_id(self, reach: CheckpointReach) -> int | None:
        link = self.link(reach)
        if link is not None:
            return self.queries.query(Worktree).find(link.worktree_id).session_agent_id
        merged = self.merged_worktrees(reach)
        if merged:
            return merged[-1].session_agent_id
        main_agent = self.agents.main_agent()
        return None if main_agent is None else main_agent.id

    def required_owner_id(self, reach: CheckpointReach) -> int:
        owner_id = self.owner_id(reach)
        if owner_id is None:
            raise Refusal(f"checkpoint reach {reach.id} has no agent to own its tests")
        return owner_id

    def compare_commit(self, reach: CheckpointReach) -> str:
        link = self.link(reach)
        if link is not None:
            return self.queries.query(Worktree).find(link.worktree_id).base_commit
        merged = self.merged_worktrees(reach)
        return merged[0].commit_before_merge if merged else ""

    def link(self, reach: CheckpointReach) -> WorktreeReach | None:
        return self.kept.read("worktree_reaches", self.queries.query(WorktreeReach).filter(reach_id=reach.id).first, "reach_id = ?", [reach.id], name="workers.reach_link")

    def merged_worktrees(self, reach: CheckpointReach) -> tuple[Worktree, ...]:
        task_ids = set(reach.tasks())
        return tuple(worktree for worktree in self.worktrees.all_worktrees() if task_ids.intersection(worktree.merged_tasks()))
