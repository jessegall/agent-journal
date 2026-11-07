from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.messages.commands.record_parent_report.record_parent_report import RecordParentReport
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.support.report_nudges import REPORT_FIELD
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED



class WorkerReportRule(DriverRule):
    """What a worker says as it stops with no task started and none queued, every task handed in, is its report
    to its main agent; with the merger on it is only kept, since the merger reads the hand-in."""

    name = "workers.report"
    hook = HookEventName.STOP
    drivers = ["*"]
    roles = [AgentRole.WORKER]

    def __init__(self, agents: AgentRows, tasks: TaskQuery, settings: SettingValues) -> None:
        self.agents, self.tasks, self.settings = agents, tasks, settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        text = f"{hook.event.raw.get(REPORT_FIELD, '')}".strip()
        main_agent_id = self.agents.find(hook.agent_id).parent_id
        if not text or main_agent_id is None or self.tasks.started_tasks(hook.agent_id) or self.tasks.next_delegated(hook.agent_id) is not None:
            return RuleAnswer.allowed()
        return RuleAnswer.allowed().running(RecordParentReport(hook.agent_id, main_agent_id, text, notify_parent=not self.settings.flag(MERGER_ENABLED)))
