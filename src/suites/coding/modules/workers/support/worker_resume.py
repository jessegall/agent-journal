from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.query.conditions.greater import Greater
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.enter_agent_line.enter_agent_line import EnterAgentLine
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.environments.models.environment import Environment
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_command import WorkerCommand
from suites.coding.modules.workers.support.worker_job import RESUMING_SOURCES
from suites.coding.modules.workers.support.worker_launcher import WorkerLauncher


class WorkerResume:
    """Resumes an ended worker's session with its waiting job as the brief. A session already on its way takes the
    line at its first hook, and with no launcher the line stays waiting."""

    def __init__(self, launcher: WorkerLauncher, queries: Queries, worktrees: WorktreeQuery, worker_command: WorkerCommand, bus: Bus) -> None:
        self.launcher, self.queries, self.worktrees, self.worker_command, self.bus = launcher, queries, worktrees, worker_command, bus

    def resume(self, worker: Agent, actor_id: int) -> None:
        worktree = self.worktrees.worker_worktree(worker.id)
        lines = self.queries.query(AgentLine).filter(agent_id=worker.id, state=AgentLineState.WAITING).oldest().all_rows()
        job = next((line for line in lines if line.source in RESUMING_SOURCES), None)
        if worktree is None or worker.ended_at is None or job is None or self.on_its_way(worker):
            return
        environment = self.queries.query(Environment).find(worktree.environment_id)
        if self.launcher.hand(worker, environment, self.worker_command.resumed(worker, worktree, environment, job.text)):
            self.bus.run(EnterAgentLine(job.id), Actor(actor_id, ActorType.AGENT), environment_id=worktree.environment_id)

    def on_its_way(self, worker: Agent) -> bool:
        return self.queries.query(AgentLine).filter(agent_id=worker.id, state=AgentLineState.ENTERED).matching(Greater("updated_at", worker.ended_at.text)).exists()
