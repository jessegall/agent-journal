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
from suites.coding.modules.workers.support.test_limit_nudges import WORKER_TEST_LIMIT_SOURCE
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from core.modules.agents.support.launch_answer import LaunchAnswer
from suites.coding.modules.workers.support.worker_command import WorkerCommand
from suites.coding.modules.workers.support.worker_job import RESUMING_SOURCES
from core.modules.agents.support.agent_launcher import AgentLauncher
from suites.coding.modules.workers.models.worktree import Worktree

JOB_DELIVERY_SECONDS = 120


class WorkerResume:
    """Resumes an ended worker's session with its waiting job as the brief. A session handed its job in the
    last two minutes is on its way and takes the line at its first hook; one that has not come back by then
    failed to start, and the next job starts it again. With no launcher the line stays waiting, and a paused
    worker stays stopped until it is resumed."""

    def __init__(self, launcher: AgentLauncher, queries: Queries, worktrees: WorktreeQuery, worker_command: WorkerCommand, bus: Bus, clock: Clock) -> None:
        self.launcher, self.queries, self.worktrees, self.worker_command, self.bus, self.clock = launcher, queries, worktrees, worker_command, bus, clock

    def resume(self, worker: Agent, actor: Actor) -> None:
        worktree = self.worktrees.worker_worktree(worker.id)
        lines = self.queries.query(AgentLine).filter(agent_id=worker.id, state=AgentLineState.WAITING).oldest().all_rows()
        job = next((line for line in sorted(lines, key=lambda line: line.source != WORKER_TEST_LIMIT_SOURCE) if line.source in RESUMING_SOURCES), None)
        if worktree is None or worker.ended_at is None or worker.paused_at is not None or self.is_job_delivering(worker, worker.ended_at):
            return
        job = job or self.lost_job(worker, worker.ended_at)
        if job is None:
            return
        self.launch_job(worker, worktree, job, actor)

    def restart(self, worker: Agent, job: AgentLine, actor: Actor) -> None:
        worktree = self.worktrees.worker_worktree(worker.id)
        last_started_at = worker.ended_at if worker.ended_at is not None else worker.creation_timestamp()
        if worktree is None or worker.paused_at is not None or self.is_job_delivering(worker, last_started_at):
            return
        self.launch_job(worker, worktree, job, actor)

    def launch_job(self, worker: Agent, worktree: Worktree, job: AgentLine, actor: Actor) -> None:
        environment = self.queries.query(Environment).find(worktree.environment_id)
        answer = self.launcher.hand(worker, environment, self.worker_command.resumed(worker, worktree, environment, job.text))
        if answer is not LaunchAnswer.STARTED:
            return
        job = self.queries.query(AgentLine).find(job.id)
        if job.state is not AgentLineState.WAITING:
            return
        self.bus.run(EnterAgentLine(job.id), actor, environment_id=worktree.environment_id)

    def is_job_delivering(self, worker: Agent, ended_at: Timestamp) -> bool:
        delivery_cutoff_at = max(ended_at.text, Timestamp(self.clock.timestamp().value - timedelta(seconds=JOB_DELIVERY_SECONDS)).text)
        return self.queries.query(AgentLine).filter(agent_id=worker.id, state=AgentLineState.ENTERED).matching(Greater("updated_at", delivery_cutoff_at)).exists()

    def lost_job(self, worker: Agent, ended_at: Timestamp) -> AgentLine | None:
        entered = self.queries.query(AgentLine).filter(agent_id=worker.id, state=AgentLineState.ENTERED).matching(Greater("updated_at", ended_at.text)).newest().all_rows()
        return next((line for line in entered if line.source in RESUMING_SOURCES), None)
