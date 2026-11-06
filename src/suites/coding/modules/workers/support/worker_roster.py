from core.base.agent_roster import AgentRoster
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class WorkerRoster(AgentRoster[Agent]):
    """Lists the workers available to hold work, and holds a worker with unmerged work from retiring."""

    def __init__(self, worktrees: WorktreeQuery) -> None:
        self.worktrees = worktrees

    def available(self, environment_id: int) -> tuple[Agent, ...]:
        return ()

    def retire_block(self, agent: Agent) -> str:
        if self.worktrees.worker_worktree(agent.id) is None:
            return ""
        return f"worker {agent.id} has unmerged work: journal worker merge {agent.id}, or journal worker release {agent.id}"
