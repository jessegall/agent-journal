from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.enter_agent_line.enter_agent_line import EnterAgentLine
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.environments.models.environment import Environment
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_command import WorkerCommand
from suites.coding.modules.workers.support.worker_job import RESUMING_SOURCES
from suites.coding.modules.workers.support.worker_launcher import WorkerLauncher


class EndedWorkerJobListener(CommitListener):
    """A job or a merge clash for a worker whose session has ended resumes that session with the line as its brief; a
    running worker reads the line at its next hook."""

    name = "workers.ended-worker-job"
    event = "agent_line.create"

    def __init__(self, launcher: WorkerLauncher, queries: Queries, worktrees: WorktreeQuery, worker_command: WorkerCommand, bus: Bus) -> None:
        self.launcher, self.queries, self.worktrees, self.worker_command, self.bus = launcher, queries, worktrees, worker_command, bus

    def handle(self, event: LoggedEvent) -> None:
        line = self.queries.query(AgentLine).find(event.row_id)
        worktree = self.worktrees.worker_worktree(line.agent_id)
        worker = self.queries.query(Agent).find(line.agent_id)
        if line.source not in RESUMING_SOURCES or worktree is None or worker.ended_at is None:
            return
        environment = self.queries.query(Environment).find(worktree.environment_id)
        self.launcher.hand(worker, environment, self.worker_command.resumed(worker, worktree, environment, line.text))
        self.bus.run(EnterAgentLine(line.id), Actor(event.actor_id, ActorType.AGENT), cause_id=event.id, environment_id=event.environment_id)
