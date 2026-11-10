from suites.coding.support.coding_helper_role import CodingHelperRole
from engine.enums.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.interval import Interval
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.span_queries import SpanQueries
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_nudges import WORKER_RUN_RUNS_AFTER_STOP
from suites.coding.modules.workers.support.worker_settings import STOPPED_WORKER_RUN_MINUTES
from suites.coding.modules.workers.support.worker_unfinished_tasks import WorkerUnfinishedTasks


class StoppedWorkerRunRule(DriverRule):
    """A tick names to the main agent each worker that stopped with tasks left and has waited past the stopped worker run minutes on a
    run that still goes, such as a server left running, since nothing else would ever start it again."""

    name = "workers.stopped-worker-run"
    hook = HookEventName.TICK
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, processes: ProcessQuery, unfinished: WorkerUnfinishedTasks, settings: SettingValues, spans: SpanQueries) -> None:
        self.queries, self.processes, self.unfinished, self.settings, self.spans = queries, processes, unfinished, settings, spans

    def answer(self, hook: AgentHook) -> RuleAnswer:
        runs = list(self.processes.running().oldest().all_rows())
        workers = {worker.id: worker for worker in self.queries.query(Agent).find_many([run.session_agent_id for run in runs])}
        limit = Interval(self.settings.minutes(STOPPED_WORKER_RUN_MINUTES))
        return RuleAnswer.with_nudges(*(WORKER_RUN_RUNS_AFTER_STOP.nudge(worker=run.session_agent_id, output=run.id) for run in runs if self.is_running_after_stop(workers[run.session_agent_id], hook, limit)))

    def is_running_after_stop(self, worker: Agent, hook: AgentHook, limit: Interval) -> bool:
        ended_at = worker.ended_at
        if worker.environment_id != hook.environment_id or worker.role != CodingHelperRole.WORKER or ended_at is None:
            return False
        return limit.has_passed(self.spans, hook.agent_id, ended_at, hook.timestamp) and bool(self.unfinished.rows(worker.id))
