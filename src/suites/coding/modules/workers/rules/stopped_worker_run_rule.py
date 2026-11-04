from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.processes.queries.process_query import ProcessQuery
from suites.coding.modules.workers.support.worker_nudges import WORKER_RUN_OUTLASTS
from suites.coding.modules.workers.support.worker_unfinished_tasks import WorkerUnfinishedTasks

STOPPED_LIMIT_SECONDS = 1800


class StoppedWorkerRunRule(DriverRule):
    """A tick names to the main agent each worker that stopped with tasks left and has waited past the limit on a
    run that still goes, such as a server left running, since nothing else would ever start it again."""

    name = "workers.stopped-worker-run"
    hook = HookEventName.TICK
    drivers = ["coding.builder", "coding.orchestrator"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, processes: ProcessQuery, unfinished: WorkerUnfinishedTasks) -> None:
        self.queries, self.processes, self.unfinished = queries, processes, unfinished

    def answer(self, hook: AgentHook) -> RuleAnswer:
        runs = self.processes.running().oldest().all_rows()
        return RuleAnswer.with_nudges(*(WORKER_RUN_OUTLASTS.nudge(worker=run.agent_id, output=run.id) for run in runs if self.is_outlasting(run.agent_id, hook)))

    def is_outlasting(self, agent_id: int, hook: AgentHook) -> bool:
        worker = self.queries.query(Agent).find(agent_id)
        ended_at = worker.ended_at
        if worker.parent_id != hook.agent_id or worker.role != AgentRole.WORKER or ended_at is None:
            return False
        return ended_at.elapsed_seconds(hook.timestamp) > STOPPED_LIMIT_SECONDS and bool(self.unfinished.rows(agent_id))
