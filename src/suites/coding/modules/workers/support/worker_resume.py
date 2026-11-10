from core.base.driver.program_lockdown import ProgramLockdown
from suites.coding.modules.workers.support.worker_routes import WorkerRoutes
from datetime import timedelta

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.driver.block_until import BlockUntil
from core.modules.tasks.commands.reset_task_reads.reset_task_reads import ResetTaskReads
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.task_brief_requirement import TaskBriefRequirement
from core.modules.tasks.support.task_nudges import TASK_BRIEF_FIRST
from core.modules.tasks.support.block_conditions.task_brief_read import TaskBriefRead
from engine.listener.event_rows import EventRows
from engine.time.clock import Clock
from engine.command.bus import Bus
from engine.query.conditions.greater import Greater
from engine.query.queries import Queries
from engine.time.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_program import AgentProgram
from suites.coding.modules.workers.support.worker_recovery_reports import WorkerRecoveryReports
from core.modules.drivers.commands.enter_agent_line.enter_agent_line import EnterAgentLine
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.agent_activity import AgentActivity
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.environments.models.environment import Environment
from suites.coding.modules.workers.support.test_limit_nudges import WORKER_TEST_LIMIT_SOURCE
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from core.modules.agents.support.launch_answer import LaunchAnswer
from suites.coding.modules.workers.support.worker_command import WorkerCommand
from suites.coding.modules.workers.support.worker_compaction import WorkerCompaction
from suites.coding.modules.workers.support.worker_job import RESUMING_SOURCES, UNFINISHED_TASKS_SOURCE
from suites.coding.modules.workers.support.worker_started_work import WorkerStartedWork
from suites.coding.modules.workers.support.worker_places import JOB_DELIVERY_SECONDS, WorkerPlaces
from core.modules.agents.support.agent_conversations import AgentConversations
from core.modules.agents.support.agent_launcher import AgentLauncher
from suites.coding.modules.workers.models.worktree import Worktree
from core.modules.helpers.support.cold_sessions import ColdSessions
from core.modules.helpers.support.program_state import ProgramState
from core.modules.helpers.support.program_states import ProgramStates
from core.modules.helpers.support.program_shares import ProgramShares
from core.modules.environments.support.environment_rows import EnvironmentRows
from engine.scope.scopes import Scopes
from core.modules.helpers.support.agent_admission import AgentAdmission
from pathlib import Path
from suites.coding.modules.workers.commands.report_worker_program_recovery.report_worker_program_recovery import ReportWorkerProgramRecovery
from suites.coding.modules.workers.support.worker_instruction_files import WorkerInstructionFiles


class WorkerResume:
    """Resumes ended workers on waiting jobs and retries a job that did not start; a worker that holds started work
    with no job waiting is given the line that tells it to go on."""

    def __init__(self, launcher: AgentLauncher, queries: Queries, worktrees: WorktreeQuery, worker_command: WorkerCommand, bus: Bus, clock: Clock, requirement: TaskBriefRequirement,
                 places: WorkerPlaces, program: AgentProgram, states: ProgramStates, shares: ProgramShares, environments: EnvironmentRows, scopes: Scopes, reports: WorkerRecoveryReports, routes: WorkerRoutes, rows: EventRows, admission: AgentAdmission, started_work: WorkerStartedWork, cold: ColdSessions, instruction_files: WorkerInstructionFiles, compaction: WorkerCompaction, conversations: AgentConversations, lockdown: ProgramLockdown) -> None:
        self.lockdown = lockdown
        self.admission, self.started_work, self.instruction_files = admission, started_work, instruction_files
        self.launcher, self.queries, self.worktrees, self.worker_command, self.bus, self.clock = launcher, queries, worktrees, worker_command, bus, clock
        self.cold, self.conversations = cold, conversations
        self.compaction = compaction
        self.requirement, self.places, self.program = requirement, places, program
        self.rows = rows
        self.states, self.reports, self.routes = states, reports, routes
        self.shares, self.environments, self.scopes = shares, environments, scopes

    def program_state(self, worker: Agent) -> ProgramState:
        with self.scopes.row_scope(worker):
            if self.shares.is_configured or self.routes.listed():
                return self.states.state(worker.program, Path(self.environments.find(worker.environment_id).folder))
            return self.states.outage_state(worker.program)

    def may_resume(self, worker: Agent) -> bool:
        with self.scopes.row_scope(worker):
            permitted = not self.admission.resume_reasons("worker", worker.profile) and not self.admission.model_reasons("worker", worker.profile, worker.program, worker.program_model)
        return permitted and not self.lockdown.lockdown(worker.program).is_active and self.program_state(worker).is_ready

    def replace_running_program(self, worker: Agent, actor: Actor) -> None:
        ended_at = worker.ended_at
        if ended_at is None or self.resume(worker, actor) is not LaunchAnswer.RUNNING:
            return
        self.program.stop(worker)
        if self.resume(worker, actor) is LaunchAnswer.RUNNING:
            self.reports.report(worker, self.running_program_reason(worker), ended_at)

    @staticmethod
    def running_program_reason(worker: Agent) -> str:
        return f"the launcher still holds its program, process {worker.pid}" if worker.pid is not None else "the launcher still holds its program"

    def resume(self, worker: Agent, actor: Actor) -> LaunchAnswer:
        if worker.ended_at is None or worker.paused_at is not None:
            return LaunchAnswer.SKIPPED
        worktree = self.worktrees.worker_worktree(worker.id)
        if worktree is None or self.is_job_delivering(worker, worker.ended_at):
            return LaunchAnswer.SKIPPED
        lines = tuple(self.queries.query(AgentLine).filter(session_agent_id=worker.id, state=AgentLineState.WAITING).oldest().all_rows())
        job = next((line for line in sorted(lines, key=lambda line: line.source != WORKER_TEST_LIMIT_SOURCE)
                    if line.source in RESUMING_SOURCES and line.source != UNFINISHED_TASKS_SOURCE), None)
        job = job or self.lost_job(worker) or next((line for line in lines if line.source == UNFINISHED_TASKS_SOURCE), None)
        if job is None and self.started_work.is_abandoned(worker):
            job = self.started_work.job(worker)
        if job is None:
            return LaunchAnswer.SKIPPED
        return self.launch_job(worker, worktree, job, actor)

    def restart(self, worker: Agent, job: AgentLine, actor: Actor) -> None:
        worktree = self.worktrees.worker_worktree(worker.id)
        last_started_at = worker.ended_at if worker.ended_at is not None else worker.creation_timestamp()
        if worktree is None or worker.paused_at is not None or self.is_job_delivering(worker, last_started_at):
            return
        self.launch_job(worker, worktree, job, actor)

    def launch_job(self, worker: Agent, worktree: Worktree, job: AgentLine, actor: Actor) -> LaunchAnswer:
        if not self.may_resume(worker) or not self.places.can_resume(worker):
            return LaunchAnswer.SKIPPED
        environment = self.queries.query(Environment).find(worktree.environment_id)
        self.instruction_files.refresh(worktree)
        with self.scopes.row_scope(worker):
            compaction_line = self.compaction.line(worker)
        if compaction_line is not None and not self.cold.is_silent(worker):
            answer = self.launcher.hand(worker, environment, self.worker_command.compacting(worker, worktree, environment, compaction_line))
            if answer is LaunchAnswer.STARTED:
                self.compaction.started(worker.id)
            return answer
        current = self.cold.replaced_silent(worker)
        command = self.worker_command.resumed(current, worktree, environment, job.text) if self.conversations.exists(current) else self.worker_command.restarted(current, worktree, environment, self.queries.query(Task).find(worktree.task_id), job.text)
        answer = self.launcher.hand(current, environment, command)
        if answer is not LaunchAnswer.STARTED:
            return answer
        stopped_at = worker.ended_at if worker.ended_at is not None else worker.creation_timestamp()
        self.bus.run(ReportWorkerProgramRecovery(worker.id, stopped_at), Actor.core(), environment_id=worktree.environment_id)
        if self.requirement.is_required:
            worker_actor = Actor(worker.id, ActorType.AGENT)
            self.bus.run(ResetTaskReads(worker.id), worker_actor, environment_id=worktree.environment_id)
            self.bus.run(BlockUntil(worker.id, TASK_BRIEF_FIRST.nudge(task=worktree.task_id), TaskBriefRead(worktree.task_id)),
                         worker_actor, environment_id=worktree.environment_id)
        job = self.queries.query(AgentLine).find(job.id)
        if job.state is AgentLineState.WAITING and self.rows.required(Agent, worker.id).pid is not None:
            self.bus.run(EnterAgentLine(job.id), actor, environment_id=worktree.environment_id)
        return answer

    def is_job_delivering(self, worker: Agent, ended_at: Timestamp) -> bool:
        if worker.pid is None:
            return False
        delivery_cutoff_at = max(ended_at.text, Timestamp(self.clock.timestamp().value - timedelta(seconds=JOB_DELIVERY_SECONDS)).text)
        return self.queries.query(AgentLine).filter(session_agent_id=worker.id, state=AgentLineState.ENTERED).matching(Greater("updated_at", delivery_cutoff_at)).exists()

    def lost_job(self, worker: Agent) -> AgentLine | None:
        activity = self.rows.required(AgentActivity, worker.id)
        last_hook = activity.last_hook_at if activity.last_hook_at is not None else activity.created_at
        entered = self.queries.query(AgentLine).filter(session_agent_id=worker.id, state=AgentLineState.ENTERED).matching(Greater("updated_at", last_hook.text)).newest().all_rows()
        return next((line for line in entered if line.source in RESUMING_SOURCES), None)
