from collections.abc import Sequence
from engine.helper_type.helper_type_book import HelperTypeBook

from suites.coding.modules.workers.commands.send_silent_agent_lines.send_silent_agent_lines import SendSilentAgentLines

from suites.coding.modules.workers.support.merger_nudges import MERGER_PROFILE
from suites.coding.modules.workers.support.worker_job import RESUMING_SOURCES
from suites.coding.modules.workers.support.worker_nudges import HELPER_INACTIVE, UNSTARTED_JOB
from suites.coding.modules.workers.support.worker_settings import INACTIVE_HELPER_GRACE_MINUTES, INACTIVE_HELPER_MINUTES
from suites.coding.modules.workers.support.worker_stop import WorkerStop
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.hook_history import HookHistory
from engine.driver.rule_answer import RuleAnswer
from engine.driver.seconds import Seconds
from engine.row.page import Page
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.among import Among
from engine.query.conditions.greater import Greater
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.helpers.support.helper_job_source import HELPER_JOB_SOURCE
from core.modules.drivers.support.agent_activities import AgentActivities
from engine.setting.setting_values import SettingValues
from core.modules.processes.queries.process_query import ProcessQuery
from suites.coding.modules.workers.support.queue_run_workers import QueueRunWorkers
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.agents.support.agent_rows import AgentRows

WAITING_WORK_SOURCES = (*RESUMING_SOURCES, HELPER_JOB_SOURCE)


class InactiveHelperRule(DriverRule):
    """A tick names each inactive helper to its parent once its grace has passed and again after the
    configured number of minutes, and in the same way each ended helper whose waiting work has not started.
    The merger waits between workers by design, so it is not named for being inactive."""

    name = "workers.inactive-helper"
    hook = HookEventName.TICK
    drivers = ["*"]
    roles = [AgentRole.MAIN, CodingHelperRole.WORKER]
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, queries: Queries, activities: AgentActivities, history: HookHistory, settings: SettingValues, processes: ProcessQuery, workers: QueueRunWorkers, requests: ReaderRequestQuery, types: HelperTypeBook, stops: WorkerStop) -> None:
        self.agents, self.queries, self.activities, self.hook_history, self.settings = agents, queries, activities, history, settings
        self.processes, self.workers = processes, workers
        self.requests = requests
        self.types, self.stops = types, stops

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return self.warning(hook).running(SendSilentAgentLines())

    def warning(self, hook: AgentHook) -> RuleAnswer:
        if self.hook_history.has_recent_answer(self.name, hook, self.settings.minutes(INACTIVE_HELPER_MINUTES)):
            return RuleAnswer.allowed()
        grace = self.settings.minutes(INACTIVE_HELPER_GRACE_MINUTES)
        activities = self.activities.read(hook)
        requesters = self.requests.active_requester_ids(hook.timestamp)
        inactive = [helper for helper in self.helpers(hook.agent_id) if helper.id in activities and helper.id not in requesters and activities[helper.id].is_inactive(hook.timestamp, grace.count)]
        unstarted = self.unstarted(hook, grace)
        if not inactive and not unstarted:
            return RuleAnswer.allowed()
        notes = self.queue_notes(inactive)
        return RuleAnswer.with_nudges(*(HELPER_INACTIVE.nudge(name=helper.role, agent=helper.id, minutes=grace.minute_count, queue=notes[helper.id], action=self.action(helper)) for helper in inactive),
                                      *(UNSTARTED_JOB.nudge(name=helper.role, agent=helper.id, minutes=grace.minute_count, action=self.action(helper)) for helper in unstarted))

    @staticmethod
    def action(helper: Agent) -> str:
        return f"journal worker status {helper.number}" if helper.role == CodingHelperRole.WORKER else "check on it"

    def unstarted(self, hook: AgentHook, grace: Seconds) -> list[Agent]:
        ended = tuple(self.queries.query(Agent).filter(parent_id=hook.agent_id).matching(Among("role", self.types.helper_keys())).matching(Greater("ended_at", "")).matching(IsNull("retired_at")).matching(IsNull("paused_at")).all_rows())
        ids = [helper.id for helper in ended]
        lines = tuple(self.queries.query(AgentLine).filter(state=AgentLineState.WAITING).matching(Among("session_agent_id", ids)).matching(Among("source", WAITING_WORK_SOURCES)).all_rows())
        jobs = tuple(self.queries.query(HelperJob).matching(Among("helper_id", ids)).matching(IsNull("ended_at")).all_rows())
        return [helper for helper in ended if self.has_unstarted_work(helper, [*(line for line in lines if line.session_agent_id == helper.id), *(job for job in jobs if job.helper_id == helper.id)], hook, grace)]

    def has_unstarted_work(self, helper: Agent, work: list[AgentLine | HelperJob], hook: AgentHook, grace: Seconds) -> bool:
        if not any(row.creation_timestamp().elapsed_seconds(hook.timestamp) >= grace.count for row in work):
            return False
        return self.stops.is_job_due(helper, work)

    def queue_notes(self, helpers: Sequence[Agent]) -> dict[int, str]:
        notes = {helper.id: "" for helper in helpers}
        queue = self.processes.running().filter(is_queue_run=True).oldest()
        rows = tuple(queue.all_rows())
        page = Page(rows, 1, max(1, len(rows)), len(rows))
        workers = self.workers.read(page)
        for position, process in enumerate(page.rows):
            worker_id = workers.get(process.id)
            if process.queued_at is None or worker_id is None or worker_id not in notes or notes[worker_id]:
                continue
            notes[worker_id] = f"; run {process.id} waits, {position} ahead"
        return notes

    def helpers(self, main_id: int) -> list[Agent]:
        roles = self.types.helper_keys()
        helpers = [agent for agent in self.agents.running(parent_id=main_id) if agent.role in roles and agent.profile != MERGER_PROFILE]
        return sorted(helpers, key=lambda helper: roles.index(helper.role))


