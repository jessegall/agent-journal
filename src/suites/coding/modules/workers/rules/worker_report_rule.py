from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.messages.commands.record_parent_report.record_parent_report import RecordParentReport
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.support.report_nudges import REPORT_FIELD
from core.modules.tasks.queries.task_query import TaskQuery
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED
from suites.coding.modules.workers.support.worker_next_task import WorkerNextTask
from suites.coding.modules.workers.support.work_units import WorkUnits



class WorkerReportRule(DriverRule):
    """What a worker says as it stops with no task started and none queued, every task handed in, is its
    report to its main agent; with the merger on it is only kept, since the merger reads the hand-in. A worker
    whose unit of several tasks is all committed stops to wait for its runs or its merge, which is no report.
    """

    name = "workers.report"
    hook = HookEventName.STOP
    drivers = ["*"]
    roles = [CodingHelperRole.WORKER]

    def __init__(self, agents: AgentRows, tasks: TaskQuery, settings: SettingValues, next_task: WorkerNextTask, units: WorkUnits) -> None:
        self.next_task, self.units = next_task, units
        self.agents, self.tasks, self.settings = agents, tasks, settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        text = f"{hook.event.raw.get(REPORT_FIELD, '')}".strip()
        main_agent_id = self.agents.find(hook.agent_id).parent_id
        if not text or main_agent_id is None or self.tasks.started_tasks(hook.agent_id) or self.next_task.following(hook.agent_id) is not None:
            return RuleAnswer.allowed()
        unit = self.units.unit(hook.agent_id)
        if unit.is_committed_unit:
            return RuleAnswer.allowed()
        return RuleAnswer.allowed().running(RecordParentReport(hook.agent_id, main_agent_id, text, notify_parent=not self.settings.flag(MERGER_ENABLED)))
