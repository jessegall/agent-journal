from core.base.agent_role import AgentRole
from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class MainAgentWorkersListener(SaveListener):
    """A new main session takes over the workers with worktrees still out in its environment."""

    name = "workers.new-main-agent"
    event = "agent.create"
    disabled_scopes = [ActorScope]

    def __init__(self, worktrees: WorktreeQuery, queries: Queries, repository: Repository) -> None:
        self.worktrees, self.queries, self.repository = worktrees, queries, repository

    def handle(self, change: Change[Model]) -> None:
        agent = change.new_row
        if not isinstance(agent, Agent) or agent.role is not AgentRole.MAIN:
            return
        for worktree in self.worktrees.environment_worktrees(agent.environment_id):
            worker = self.queries.query(Agent).find(worktree.agent_id)
            self.repository.save(worker.changed(parent_id=agent.id), change.context)
