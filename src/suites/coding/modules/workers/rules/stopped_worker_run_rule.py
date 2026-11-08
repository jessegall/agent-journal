from suites.coding.support.coding_helper_kind import CodingHelperKind
from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.processes.queries.process_query import ProcessQuery
from suites.coding.modules.workers.support.worker_nudges import WORKER_RUN_RUNS_AFTER_STOP
from suites.coding.modules.workers.support.worker_unfinished_tasks import WorkerUnfinishedTasks

STOPPED_LIMIT_SECONDS = 1800


class StoppedWorkerRunRule(DriverRule):
    """A tick names to the main agent each worker that stopped with tasks left and has waited past the limit on a
    run that still goes, such as a server left running, since nothing else would ever start it again."""

    name = "workers.stopped-worker-run"
    hook = HookEventName.TICK
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, processes: ProcessQuery, unfinished: WorkerUnfinishedTasks) -> None:
        self.queries, self.processes, self.unfinished = queries, processes, unfinished

    def answer(self, hook: AgentHook) -> RuleAnswer:
        runs = list(self.processes.running().oldest().all_rows())
        workers = {worker.id: worker for worker in self.queries.query(Agent).find_many([run.session_agent_id for run in runs])}
        return RuleAnswer.with_nudges(*(WORKER_RUN_RUNS_AFTER_STOP.nudge(worker=run.session_agent_id, output=run.id) for run in runs if self.is_running_after_stop(workers[run.session_agent_id], hook)))

    def is_running_after_stop(self, worker: Agent, hook: AgentHook) -> bool:
        ended_at = worker.ended_at
        if worker.environment_id != hook.environment_id or worker.role != CodingHelperKind.WORKER or ended_at is None:
            return False
        return ended_at.elapsed_seconds(hook.timestamp) > STOPPED_LIMIT_SECONDS and bool(self.unfinished.rows(worker.id))
