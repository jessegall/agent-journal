from collections import defaultdict

from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.enums.connection_status import ConnectionStatus
from engine.connection.internet_connection import InternetConnection
from engine.journal.journal_home import JournalHome
from engine.query.conditions.among import Among
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_activity import AgentActivity
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.support.nudger import Nudger
from core.modules.drivers.support.main_agent_line import MainAgentLine
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.commands.send_silent_agent_lines.send_silent_agent_lines import SendSilentAgentLines
from suites.coding.modules.workers.commands.report_silent_agent.report_silent_agent import ReportSilentAgent
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.support.main_agent_work import MainAgentWork
from suites.coding.modules.workers.support.worker_job import SILENT_AGENT_SOURCE, RESUMING_SOURCES
from suites.coding.modules.workers.support.worker_places import WorkerPlaces
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from suites.coding.modules.workers.support.worker_nudges import IDLE_WORKER, SILENT_AGENT_CONTINUE, SILENT_WORKER_CONTINUE
from suites.coding.modules.workers.support.worker_settings import SILENT_AGENT_MINUTES, IDLE_WORKER_MINUTES, IDLE_WORKER_REPEAT_MINUTES, RESUME_SILENT_AGENTS
from suites.coding.modules.workers.support.worker_stop import WorkerStop
from engine.enums.agent_role import AgentRole
from core.modules.agents.support.agent_rows import AgentRows
from suites.coding.support.coding_settings import AUTO_MODE_SETTING

RECOVERY_ATTEMPTS = 3
CHECKED_AGENTS_REASON = "One activity row for each running agent and each worker that is not retired, which the agent limits bound."


class SendSilentAgentLinesHandler(Handler[SendSilentAgentLines, None]):
    """Sends a bounded sequence of waking lines to silent agents with work, excluding explicit waits and runs.
    The main agent has work to go on with when an open task has no worker and does not belong to a plan
    that is not approved or started: such a plan cannot start before the person approves it. It reads the
    running agents and the workers that are not retired, never an agent that ended for good."""

    command = SendSilentAgentLines
    disabled_scopes = [ActorScope]

    def __init__(self, home: JournalHome, queries: Queries, settings: SettingValues,
                 work: MainAgentWork, nudger: Nudger, bus: Bus, stop: WorkerStop, main_line: MainAgentLine, places: WorkerPlaces, task_query: TaskQuery, agent_rows: AgentRows) -> None:
        self.task_query, self.agent_rows = task_query, agent_rows
        self.home, self.queries, self.settings = home, queries, settings
        self.work, self.nudger, self.bus, self.stop, self.main_line, self.places = work, nudger, bus, stop, main_line, places

    def handle(self, command: SendSilentAgentLines, context: Context) -> None:
        agents = tuple(agent for agent in self.checked_agents() if agent.halted_at is None)
        agent_ids = tuple(agent.id for agent in agents)
        activities = {row.id: row for row in self.queries.query(AgentActivity).matching(Among("id", agent_ids)).full_table(CHECKED_AGENTS_REASON).all_rows()}
        working = set(self.work.unfinished_tasks(agent_ids))
        tasks_remain = self.task_query.open_tasks().matching(IsNull("delegated_to")).matching(self.task_query.unapproved_plan_exclusion()).exists()
        worktrees = tuple(self.queries.query(Worktree).all_rows())
        workers = {row.session_agent_id for row in worktrees}
        excluded = self.work.waiting_agents(agent_ids, context.timestamp)
        self.report_idle_workers(context, agents, activities, working, worktrees, excluded)
        connection = InternetConnection.shared(self.home)
        if connection.status is not ConnectionStatus.ONLINE:
            return
        lines: dict[int, list[AgentLine]] = defaultdict(list)
        for line in self.queries.query(AgentLine).matching(Among("session_agent_id", agent_ids)).filter(source=SILENT_AGENT_SOURCE).oldest().all_rows():
            lines[line.session_agent_id].append(line)
        span = self.settings.minutes(SILENT_AGENT_MINUTES)
        resumes = self.settings.flag(RESUME_SILENT_AGENTS)
        for agent in agents:
            if not resumes and agent.role != AgentRole.MAIN:
                continue
            has_work = agent.id in working or (agent.role == AgentRole.MAIN and tasks_remain and self.is_automatic(agent))
            activity = activities[agent.id]
            if not has_work or agent.id in excluded or agent.paused_at is not None or not activity.is_inactive(context.timestamp, span.count):
                continue
            if agent.ended_at is not None and (agent.id not in workers or self.stop.was_stopped(agent)):
                continue
            activity_at = activity.last_hook_at if activity.last_hook_at is not None else activity.created_at
            attempts = [line for line in lines[agent.id] if line.creation_timestamp() > activity_at
                        and (connection.reconnected_at is None or line.creation_timestamp() >= connection.reconnected_at)]
            if attempts and attempts[-1].creation_timestamp().elapsed_seconds(context.timestamp) < span.count * 2 ** len(attempts):
                continue
            if len(attempts) >= RECOVERY_ATTEMPTS:
                self.bus.dispatch(ReportSilentAgent(agent.id, "three waking lines got no hook", activity_at), context)
                continue
            declaration = SILENT_WORKER_CONTINUE if agent.id in workers else SILENT_AGENT_CONTINUE
            self.nudger.send(agent.id, declaration, SILENT_AGENT_SOURCE, context)

    def report_idle_workers(self, context: Context, agents: tuple[Agent, ...], activities: dict[int, AgentActivity], working: set[int],
                            worktrees: tuple[Worktree, ...], excluded: set[int]) -> None:
        workers = {row.session_agent_id for row in worktrees if row.state is WorktreeState.CUT}
        stalled = {row.session_agent_id for row in worktrees if row.state is WorktreeState.DELIVERED and row.tests_passed_at is None and row.returned_at is None}
        waiting_jobs = {row.session_agent_id for row in self.queries.query(AgentLine).filter(state=AgentLineState.WAITING).matching(Among("source", RESUMING_SOURCES)).all_rows()}
        notices = tuple(self.queries.query(AgentLine).filter(source=IDLE_WORKER.key).oldest().all_rows())
        grace = self.settings.minutes(IDLE_WORKER_MINUTES).count
        repeat = self.settings.minutes(IDLE_WORKER_REPEAT_MINUTES).count
        for worker in agents:
            if worker.ended_at is None or worker.paused_at is not None or worker.id in excluded:
                continue
            if worker.id not in stalled and (worker.id not in workers or worker.id not in working):
                continue
            if worker.id in waiting_jobs and not self.places.can_resume(worker):
                continue
            activity = activities[worker.id]
            activity_at = max(worker.ended_at, activity.last_hook_at or activity.created_at)
            if activity_at.elapsed_seconds(context.timestamp) < grace:
                continue
            line = IDLE_WORKER.nudge(worker=worker.id)
            previous = [row for row in notices if row.text == line.text and row.creation_timestamp() >= activity_at]
            if previous and previous[-1].creation_timestamp().elapsed_seconds(context.timestamp) < repeat:
                continue
            self.main_line.send(line.text, IDLE_WORKER.key, context)

    def checked_agents(self) -> tuple[Agent, ...]:
        checked = {agent.id: agent for agent in (*self.agent_rows.running(), *self.places.kept_workers())}
        return tuple(checked[agent_id] for agent_id in sorted(checked))

    def is_automatic(self, agent: Agent) -> bool:
        with self.bus.scopes.read_scope((), None, agent.environment_id):
            return self.settings.flag(AUTO_MODE_SETTING)
