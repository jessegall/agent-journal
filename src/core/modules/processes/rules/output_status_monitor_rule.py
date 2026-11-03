from core.modules.processes.support.process_nudges import MONITOR_NOTE
from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.part import Part
from core.base.driver.rule_answer import RuleAnswer
from core.modules.processes.support.background_commands import JOURNAL

OUTPUT_STATUS_COMMAND = ["output", "status"]


class OutputStatusMonitorRule(DriverRule):
    """An agent that asks for a run's status is told to set a Monitor on its end instead of asking again."""

    name = "processes.status-monitor"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        numbers = [part.arguments[2] for part in shell.parts if self.is_status(part)] if shell is not None else []
        return RuleAnswer.with_nudges(*(MONITOR_NOTE.nudge(output=number) for number in numbers))

    def is_status(self, part: Part) -> bool:
        return part.program == JOURNAL and list(part.arguments[:2]) == OUTPUT_STATUS_COMMAND and len(part.arguments) > 2
