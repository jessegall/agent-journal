from collections import defaultdict

from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.connection_status import ConnectionStatus
from core.base.internet_connection import InternetConnection
from core.base.journal_home import JournalHome
from core.base.query.conditions.among import Among
from core.base.query.conditions.greater import Greater
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_activity import AgentActivity
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.support.nudger import Nudger
from core.modules.drivers.support.main_agent_line import MainAgentLine
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.reviews.models.review import Review
from core.modules.reviews.models.enums.review_state import ReviewState
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.waits.models.wait import Wait
from core.modules.waits.models.enums.wait_state import WaitState
from suites.coding.support.coding_settings import AUTO_MODE_SETTING
from suites.coding.modules.workers.commands.send_silent_agent_lines.send_silent_agent_lines import SendSilentAgentLines
from suites.coding.modules.workers.commands.report_silent_agent.report_silent_agent import ReportSilentAgent
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.enums.proof_state import TEST_WAITING_STATES
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.support.worker_job import SILENT_AGENT_SOURCE, RESUMING_SOURCES
from suites.coding.modules.workers.support.worker_places import WorkerPlaces
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from suites.coding.modules.workers.support.worker_nudges import IDLE_WORKER, SILENT_AGENT_CONTINUE, SILENT_WORKER_CONTINUE
from suites.coding.modules.workers.support.worker_settings import SILENT_AGENT_MINUTES, IDLE_WORKER_MINUTES, IDLE_WORKER_REPEAT_MINUTES
from suites.coding.modules.workers.support.worker_stop import WorkerStop
from suites.coding.support.coding_agent_role import CodingAgentRole

RECOVERY_ATTEMPTS = 3


class SendSilentAgentLinesHandler(Handler[SendSilentAgentLines, None]):
    """Sends a bounded sequence of waking lines to silent agents with work, excluding explicit waits and runs."""

    command = SendSilentAgentLines
    disabled_scopes = [ActorScope]

    def __init__(self, home: JournalHome, queries: Queries, settings: SettingValues,
                 processes: ProcessQuery, nudger: Nudger, bus: Bus, stop: WorkerStop, main_line: MainAgentLine, places: WorkerPlaces) -> None:
        self.home, self.queries, self.settings = home, queries, settings
        self.processes, self.nudger, self.bus, self.stop, self.main_line, self.places = processes, nudger, bus, stop, main_line, places

    def handle(self, command: SendSilentAgentLines, context: Context) -> None:
        agents = tuple(self.queries.query(Agent).all_rows())
        agent_ids = tuple(agent.id for agent in agents)
        activities = {row.id: row for row in self.queries.query(AgentActivity).matching(Among("id", agent_ids)).all_rows()}
        tasks = tuple(self.queries.query(Task).matching(Among("state", [TaskState.OPEN, TaskState.STARTED])).all_rows())
        working = {agent_id for task in tasks for agent_id in [task.holder_id, task.delegated_to] if agent_id is not None}
        worktrees = tuple(self.queries.query(Worktree).all_rows())
        workers = {row.session_agent_id for row in worktrees}
        excluded = self.waiting(agent_ids, context)
        self.report_idle_workers(context, agents, activities, working, worktrees, excluded)
        connection = InternetConnection.shared(self.home)
        if connection.status is not ConnectionStatus.ONLINE:
            return
        lines: dict[int, list[AgentLine]] = defaultdict(list)
        for line in self.queries.query(AgentLine).matching(Among("session_agent_id", agent_ids)).filter(source=SILENT_AGENT_SOURCE).oldest().all_rows():
            lines[line.session_agent_id].append(line)
        span = self.settings.minutes(SILENT_AGENT_MINUTES)
        for agent in agents:
            has_work = agent.id in working or (agent.role == CodingAgentRole.MAIN and bool(tasks) and self.settings.flag(AUTO_MODE_SETTING))
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
        waiting_jobs = {row.session_agent_id for row in self.queries.query(AgentLine).filter(state=AgentLineState.WAITING).matching(Among("source", RESUMING_SOURCES)).all_rows()}
        notices = tuple(self.queries.query(AgentLine).filter(source=IDLE_WORKER.key).oldest().all_rows())
        grace = self.settings.minutes(IDLE_WORKER_MINUTES).count
        repeat = self.settings.minutes(IDLE_WORKER_REPEAT_MINUTES).count
        for worker in agents:
            if worker.ended_at is None or worker.paused_at is not None or worker.id not in workers or worker.id not in working or worker.id in excluded:
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

    def waiting(self, agent_ids: tuple[int, ...], context: Context) -> set[int]:
        excluded = {row.session_agent_id for row in self.processes.running().all_rows()}
        excluded.update(row.session_agent_id for row in self.queries.query(Wait).matching(Among("session_agent_id", agent_ids)).filter(state=WaitState.OPEN).all_rows())
        excluded.update(row.creator_id for row in self.queries.query(Proof).matching(Among("creator_id", agent_ids)).matching(Among("state", TEST_WAITING_STATES)).all_rows())
        excluded.update(row.requester_id for row in self.queries.query(Review).matching(Among("state", [ReviewState.QUEUED, ReviewState.REVIEWING])).all_rows())
        excluded.update(row.creator_id for row in self.queries.query(ReaderRequest).matching(Among("creator_id", agent_ids)).filter(completed_at=None).matching(Greater("expires_at", context.timestamp.text)).all_rows())
        return excluded
