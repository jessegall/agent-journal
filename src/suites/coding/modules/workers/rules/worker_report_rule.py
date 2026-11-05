from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.commands.record_worker_report.record_worker_report import RecordWorkerReport

REPORT_FIELD = "last_assistant_message"


class WorkerReportRule(DriverRule):
    """What a worker says as it stops with no task started and none queued, every task handed in, is its report
    to its main agent."""

    name = "workers.report"
    hook = HookEventName.STOP
    drivers = ["*"]
    roles = [AgentRole.WORKER]

    def __init__(self, queries: Queries, tasks: TaskQuery) -> None:
        self.queries, self.tasks = queries, tasks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        text = f"{hook.event.raw.get(REPORT_FIELD, '')}".strip()
        main_agent_id = self.queries.query(Agent).find(hook.agent_id).parent_id
        if not text or main_agent_id is None or self.tasks.holder(hook.agent_id).started().exists() or self.tasks.next_delegated(hook.agent_id) is not None:
            return RuleAnswer.allowed()
        return RuleAnswer.allowed().running(RecordWorkerReport(hook.agent_id, main_agent_id, text))
