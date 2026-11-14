from engine.actor.actor import Actor
from engine.agent.agent_roster import AgentRoster
from engine.command.bus import Bus
from engine.command.context import Context
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.tasks.commands.unassign_agent_tasks.unassign_agent_tasks import UnassignAgentTasks
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.drop_agent_line.remove_agent_line import RemoveAgentLine
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.environments.models.environment import Environment
from suites.coding.modules.workers.commands.release_worker.release_worker import ReleaseWorker
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worktree_own_changes import WorktreeOwnChanges
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from core.modules.agents.support.agent_label import AgentLabel

RETIRED_WORKER_REASON = "a retired worker is checked on every worktree it had and gives up every waiting line"


class WorkerRoster(AgentRoster[Agent]):
    """Lists the workers available to hold work. A worker with unmerged or uncommitted work is held from retiring;
    retiring any other releases what it holds: its queued tasks, its waiting lines and its clean worktree."""

    def __init__(self, worktrees: WorktreeQuery, git: WorktreeGit, queries: Queries, bus: Bus, repository: Repository, worker_changes: WorktreeOwnChanges) -> None:
        self.worktrees, self.git, self.queries, self.bus, self.repository, self.own_changes = worktrees, git, queries, bus, repository, worker_changes

    def available(self, environment_id: int) -> tuple[Agent, ...]:
        return ()

    def retire_block(self, agent: Agent) -> str:
        folder = self.queries.query(Environment).find(agent.environment_id).folder
        for worktree in self.queries.query(Worktree).filter(session_agent_id=agent.id).with_removed().every_row(RETIRED_WORKER_REASON):
            if self.own_changes.has_worker_changes(agent, worktree):
                return f"{AgentLabel.labelled(agent).text} has uncommitted files in {worktree.folder}: commit or remove them, then retire it"
            if self.git.has_unmerged_branch(folder, worktree):
                return f"{AgentLabel.labelled(agent).text} has unmerged work on {worktree.branch}: journal worker merge {agent.number}, or merge the branch by hand"
        return ""

    def release(self, agent: Agent, actor: Actor) -> None:
        if self.worktrees.worker_worktree(agent.id) is not None:
            self.bus.run(ReleaseWorker(agent.id, "retired"), actor, environment_id=agent.environment_id)

    def release_pending_work(self, agent: Agent, context: Context) -> None:
        self.bus.dispatch(UnassignAgentTasks(agent.id), context)
        for line in tuple(self.queries.query(AgentLine).filter(session_agent_id=agent.id, state=AgentLineState.WAITING).every_row(RETIRED_WORKER_REASON)):
            self.bus.dispatch(RemoveAgentLine(line.id), context)
