from pathlib import Path

from engine.actor.actor import Actor
from core.base.agent_roster import AgentRoster
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.tasks.clear_delegated_tasks import ClearDelegatedTasks
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.drop_agent_line.remove_agent_line import RemoveAgentLine
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.environments.models.environment import Environment
from suites.coding.modules.workers.commands.release_worker.release_worker import ReleaseWorker
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.journal_managed_files import JournalManagedFiles
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class WorkerRoster(AgentRoster[Agent]):
    """Lists the workers available to hold work. A worker with unmerged or uncommitted work is held from retiring;
    retiring any other releases what it holds: its queued tasks, its waiting lines and its clean worktree."""

    def __init__(self, worktrees: WorktreeQuery, git: WorktreeGit, queries: Queries, bus: Bus, repository: Repository, managed_files: JournalManagedFiles) -> None:
        self.worktrees, self.git, self.queries, self.bus, self.repository, self.managed_files = worktrees, git, queries, bus, repository, managed_files

    def available(self, environment_id: int) -> tuple[Agent, ...]:
        return ()

    def retire_block(self, agent: Agent) -> str:
        folder = self.queries.query(Environment).find(agent.environment_id).folder
        for worktree in self.queries.query(Worktree).filter(session_agent_id=agent.id).with_removed().all_rows():
            if self.has_own_changes(agent, worktree):
                return f"worker {agent.id} has uncommitted files in {worktree.folder}: commit or remove them, then retire it"
            if self.git.has_unmerged_branch(folder, worktree):
                return f"worker {agent.id} has unmerged work on {worktree.branch}: journal worker merge {agent.id}, or merge the branch by hand"
        return ""

    def has_own_changes(self, agent: Agent, worktree: Worktree) -> bool:
        if worktree.removed_at is not None or not Path(worktree.folder).exists():
            return False
        return any(not self.managed_files.has(agent, path) for path in self.git.uncommitted_files(worktree.folder))

    def release(self, agent: Agent, actor: Actor) -> None:
        if self.worktrees.worker_worktree(agent.id) is not None:
            self.bus.run(ReleaseWorker(agent.id, "retired"), actor, environment_id=agent.environment_id)

    def release_pending_work(self, agent: Agent, context: Context) -> None:
        self.bus.dispatch(ClearDelegatedTasks(agent.id), context)
        for line in tuple(self.queries.query(AgentLine).filter(session_agent_id=agent.id, state=AgentLineState.WAITING).all_rows()):
            self.bus.dispatch(RemoveAgentLine(line.id), context)
