from core.base.agent_role import AgentRole
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.tasks.support.task_takers import TaskTakers
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class WorkerTaskTakers(TaskTakers):
    """The main agent and a worker whose worktree is cut take a task; a worker whose work is delivered, or any
    other helper, never starts one."""

    def __init__(self, worktrees: WorktreeQuery) -> None:
        self.worktrees = worktrees

    def check(self, agent: Agent) -> None:
        worktree = self.worktrees.worker_worktree(agent.id) if agent.role is AgentRole.WORKER else None
        if agent.role is not AgentRole.MAIN and (worktree is None or worktree.state is not WorktreeState.CUT):
            raise Refusal(f"agent {agent.id} is a {agent.role.value} and takes no task", "only the main agent and a worker with a cut worktree take a task")
