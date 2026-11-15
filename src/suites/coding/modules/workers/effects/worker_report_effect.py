from collections.abc import Sequence

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.effect import Effect
from engine.agent_machine.decision_record import DecisionRecord
from engine.command.command import Command
from engine.enums.effect_timing import EffectTiming
from engine.enums.hook_event_name import HookEventName
from engine.setting.setting_values import SettingValues
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.support.report_nudges import REPORT_FIELD
from core.modules.messages.commands.record_parent_report.record_parent_report import RecordParentReport
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.support.work_units import WorkUnits
from suites.coding.modules.workers.support.worker_next_task import WorkerNextTask
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED
from suites.coding.modules.workers.types.worker import Worker


class WorkerReportEffect(Effect):
    """What a worker says as it is allowed to stop with no task started and none queued is its report to its main
    agent (doc 1310 section 4.9); with the merger on it is only kept, since the merger reads the hand-in. A worker
    whose unit of several tasks is all committed stops to wait for its runs or its merge, which is no report. It is
    not required: a report that cannot be saved becomes a line."""

    events = [HookEventName.STOP]
    agent_types = [Worker.key]
    replaced_rules = tuple(["workers.report"])
    timing = EffectTiming.ON_ADMISSION

    def __init__(self, agents: AgentRows, tasks: TaskQuery, settings: SettingValues, next_task: WorkerNextTask, units: WorkUnits) -> None:
        self.agents, self.tasks, self.settings, self.next_task, self.units = agents, tasks, settings, next_task, units

    def commands(self, view: AgentView, record: DecisionRecord) -> Sequence[Command[object]]:
        event = record.action.event
        agent_id = view.agent.agent_id
        text = f"{event.raw.get(REPORT_FIELD, '')}".strip() if event is not None else ""
        main_agent_id = self.agents.find(agent_id).parent_id
        if not text or main_agent_id is None or self.tasks.started_tasks(agent_id) or self.next_task.following(agent_id) is not None or self.units.unit(agent_id).is_committed_unit:
            return []
        return [RecordParentReport(agent_id, main_agent_id, text, notify_parent=not self.settings.flag(MERGER_ENABLED))]
