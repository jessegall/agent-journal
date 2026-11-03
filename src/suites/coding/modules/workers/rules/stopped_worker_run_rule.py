from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.nudge import Nudge
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
        nudges: list[Nudge] = []
        for worker in self.queries.query(Agent).filter(parent_id=hook.agent_id, role=AgentRole.WORKER).all_rows():
            ended_at = worker.ended_at
            if ended_at is None or ended_at.elapsed_seconds(hook.timestamp) <= STOPPED_LIMIT_SECONDS or not self.unfinished.rows(worker.id):
                continue
            nudges.extend(WORKER_RUN_OUTLASTS.nudge(worker=worker.id, output=run.id) for run in self.processes.agent(worker.id).running().oldest().all_rows())
        return RuleAnswer.with_nudges(*nudges)
