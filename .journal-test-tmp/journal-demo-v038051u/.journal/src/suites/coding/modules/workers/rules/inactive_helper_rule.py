from collections.abc import Sequence
from core.base.agent_type_book import AgentTypeBook

from suites.coding.modules.workers.commands.send_silent_agent_lines.send_silent_agent_lines import SendSilentAgentLines

from suites.coding.modules.workers.support.worker_nudges import HELPER_INACTIVE
from suites.coding.modules.workers.support.worker_settings import INACTIVE_HELPER_MINUTES
from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_history import HookHistory
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.seconds import Seconds
from core.base.query.conditions.is_null import IsNull
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_activity import AgentActivity
from core.modules.drivers.support.agent_activities import AgentActivities
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.processes.queries.process_query import ProcessQuery
from suites.coding.modules.workers.support.queue_run_workers import QueueRunWorkers
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery

class InactiveHelperRule(DriverRule):
    """A tick names each inactive helper to its parent again after the configured number of minutes."""

    name = "workers.inactive-helper"
    hook = HookEventName.TICK
    drivers = ["coding.builder", "coding.orchestrator"]
    roles = [AgentRole.MAIN]
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, activities: AgentActivities, history: HookHistory, settings: SettingValues, processes: ProcessQuery, workers: QueueRunWorkers, requests: ReaderRequestQuery, types: AgentTypeBook) -> None:
        self.queries, self.activities, self.hook_history, self.settings = queries, activities, history, settings
        self.processes, self.workers = processes, workers
        self.requests = requests
        self.types = types

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return self.warning(hook).running(SendSilentAgentLines(hook.environment_id))

    def warning(self, hook: AgentHook) -> RuleAnswer:
        span = self.settings.minutes(INACTIVE_HELPER_MINUTES, hook.environment_id)
        if self.hook_history.has_recent_answer(self.name, hook, span):
            return RuleAnswer.allowed()
        activities = self.activities.read(hook)
        inactive = [helper for helper in self.helpers(hook.agent_id) if self.is_inactive(helper, activities[helper.id], hook, span)]
        if not inactive:
            return RuleAnswer.allowed()
        notes = self.queue_notes(inactive, hook.environment_id)
        return RuleAnswer.with_nudges(*(HELPER_INACTIVE.nudge(name=helper.role, agent=helper.id, minutes=span.whole_minutes, queue=notes[helper.id], action=f"journal worker status {helper.id}" if helper.role == AgentRole.WORKER else "check on it") for helper in inactive))

    def queue_notes(self, helpers: Sequence[Agent], environment_id: int) -> dict[int, str]:
        notes = {helper.id: "" for helper in helpers}
        queue = self.processes.environment(environment_id).running().filter(is_queue_run=True).oldest()
        page = queue.page(1, max(1, queue.count()))
        workers = self.workers.read(page)
        for position, process in enumerate(page.rows):
            worker_id = workers.get(process.id)
            if process.queued_at is None or worker_id is None or worker_id not in notes or notes[worker_id]:
                continue
            notes[worker_id] = f"; run {process.id} waits, {position} ahead"
        return notes

    def helpers(self, main_id: int) -> list[Agent]:
        roles = self.types.derived_types("helper")
        helpers = self.queries.query(Agent).filter(parent_id=main_id).matching(Among("role", roles)).matching(IsNull("ended_at")).oldest().all_rows()
        return sorted(helpers, key=lambda helper: roles.index(helper.role))

    def is_inactive(self, helper: Agent, activity: AgentActivity, hook: AgentHook, span: Seconds) -> bool:
        if self.requests.has_active_requests(helper.id, hook.timestamp):
            return False
        return activity.is_inactive(hook.timestamp, span.count)

