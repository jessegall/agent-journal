from datetime import timedelta

from core.base.actor import Actor
from core.base.clock import Clock
from core.base.command.bus import Bus
from core.base.query.conditions.greater import Greater
from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.enter_agent_line.enter_agent_line import EnterAgentLine
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.environments.models.environment import Environment
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.launch_answer import LaunchAnswer
from suites.coding.modules.workers.support.worker_command import WorkerCommand
from suites.coding.modules.workers.support.worker_job import RESUMING_SOURCES
from suites.coding.modules.workers.support.worker_launcher import WorkerLauncher

JOB_DELIVERY_SECONDS = 120


class WorkerResume:
    """Resumes an ended worker's session with its waiting job as the brief. A session handed its job in the
    last two minutes is on its way and takes the line at its first hook; one that has not come back by then
    failed to start, and the next job starts it again. With no launcher the line stays waiting."""

    def __init__(self, launcher: WorkerLauncher, queries: Queries, worktrees: WorktreeQuery, worker_command: WorkerCommand, bus: Bus, clock: Clock) -> None:
        self.launcher, self.queries, self.worktrees, self.worker_command, self.bus, self.clock = launcher, queries, worktrees, worker_command, bus, clock

    def resume(self, worker: Agent, actor: Actor) -> None:
        worktree = self.worktrees.worker_worktree(worker.id)
        lines = self.queries.query(AgentLine).filter(agent_id=worker.id, state=AgentLineState.WAITING).oldest().all_rows()
        job = next((line for line in lines if line.source in RESUMING_SOURCES), None)
        if worktree is None or worker.ended_at is None or self.is_job_delivering(worker, worker.ended_at):
            return
        job = job or self.lost_job(worker, worker.ended_at)
        if job is None:
            return
        environment = self.queries.query(Environment).find(worktree.environment_id)
        answer = self.launcher.hand(worker, environment, self.worker_command.resumed(worker, worktree, environment, job.text))
        if answer is LaunchAnswer.STARTED and job.state is AgentLineState.WAITING:
            self.bus.run(EnterAgentLine(job.id), actor, environment_id=worktree.environment_id)

    def is_job_delivering(self, worker: Agent, ended_at: Timestamp) -> bool:
        start = max(ended_at.text, Timestamp(self.clock.timestamp().value - timedelta(seconds=JOB_DELIVERY_SECONDS)).text)
        return self.queries.query(AgentLine).filter(agent_id=worker.id, state=AgentLineState.ENTERED).matching(Greater("updated_at", start)).exists()

    def lost_job(self, worker: Agent, ended_at: Timestamp) -> AgentLine | None:
        entered = self.queries.query(AgentLine).filter(agent_id=worker.id, state=AgentLineState.ENTERED).matching(Greater("updated_at", ended_at.text)).newest().all_rows()
        return next((line for line in entered if line.source in RESUMING_SOURCES), None)
