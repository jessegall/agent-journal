from datetime import timedelta

from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.greater import Greater
from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.drivers.models.hook_call import HookCall
from core.modules.processes.models.enums.process_setting import ProcessSetting
from core.modules.processes.models.process import Process
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.process_settings import ProcessSettings


REMINDER_PERIOD = timedelta(minutes=30)


class UnreadOutputReminderRule(DriverRule):
    """Names in one line, every few tool uses counted from the newest, the outputs of runs an agent
    moved to the background and has not read, each for half an hour after its run ended."""

    name = "processes.unread-output-reminder"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, processes: ProcessQuery, settings: ProcessSettings, queries: Queries) -> None:
        self.processes, self.settings, self.queries = processes, settings, queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        spacing = max(1, self.settings.integer(ProcessSetting.UNREAD_OUTPUT_TOOL_USES, hook.environment_id))
        ended_runs = list(self.processes.agent(hook.agent_id).moved().ended().unread().matching(Greater("ended_at", Timestamp(hook.timestamp.value - REMINDER_PERIOD).text)).oldest().all_rows())
        if not ended_runs or (self.tool_uses(hook, ended_runs[-1]) + 1) % spacing:
            return RuleAnswer.allowed()
        return RuleAnswer.with_lines(f"output {', '.join(str(process.id) for process in ended_runs)} unread: journal output read {ended_runs[0].id} --summary")

    def tool_uses(self, hook: AgentHook, process: Process) -> int:
        return self.queries.query(HookCall).filter(agent_id=hook.agent_id, hook=HookEventName.POST_TOOL_USE).matching(Greater("created_at", process.ended_at.text)).count() if process.ended_at else 0
