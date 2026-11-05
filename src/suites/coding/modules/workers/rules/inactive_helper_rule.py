from collections.abc import Sequence
from core.base.agent_type_book import AgentTypeBook

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
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.drivers.queries.hook_call_query import HookCallQuery
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

    def __init__(self, queries: Queries, calls: HookCallQuery, history: HookHistory, settings: SettingValues, processes: ProcessQuery, workers: QueueRunWorkers, requests: ReaderRequestQuery, types: AgentTypeBook) -> None:
        self.queries, self.calls, self.hook_history, self.settings = queries, calls, history, settings
        self.processes, self.workers = processes, workers
        self.requests = requests
        self.types = types

    def answer(self, hook: AgentHook) -> RuleAnswer:
        span = self.settings.minutes(INACTIVE_HELPER_MINUTES, hook.environment_id)
        if self.hook_history.has_recent_answer(self.name, hook, span):
            return RuleAnswer.allowed()
        inactive = [helper for helper in self.helpers(hook.agent_id) if self.is_inactive(helper, hook, span)]
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
        return [helper for role in self.types.derived_types("helper") for helper in self.queries.query(Agent).filter(parent_id=main_id, role=role).matching(IsNull("ended_at")).oldest().all_rows()]

    def is_inactive(self, helper: Agent, hook: AgentHook, span: Seconds) -> bool:
        if self.requests.has_active_requests(helper.id, hook.timestamp):
            return False
        newest = self.calls.newest_agent_hook(helper.id)
        activity_at = newest.created_at if newest is not None else helper.created_at
        return activity_at is not None and activity_at.elapsed_seconds(hook.timestamp) >= span.count

