from core.modules.processes.support.process_nudges import MONITOR_COMMAND_NOTE, MONITOR_NOTE
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.part import Part
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.tool_type import ToolType
from core.base.provider.providers import Providers
from core.modules.processes.support.background_commands import JOURNAL

OUTPUT_STATUS_COMMAND = ["output", "status"]


class OutputStatusMonitorRule(DriverRule):
    """An agent that asks for a run's status is told to watch its end instead of asking again: to set a Monitor on
    it, or, when its program has no Monitor tool, to run journal output monitor in its shell."""

    name = "processes.status-monitor"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def __init__(self, providers: Providers) -> None:
        self.providers = providers

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        numbers = [part.arguments[2] for part in shell.parts if self.is_status(part)] if shell is not None else []
        note = MONITOR_COMMAND_NOTE if self.providers.provider(hook.event.program).monitor_tool is ToolType.SHELL else MONITOR_NOTE
        return RuleAnswer.with_nudges(*(note.nudge(output=number) for number in numbers))

    def is_status(self, part: Part) -> bool:
        return part.program == JOURNAL and list(part.arguments[:2]) == OUTPUT_STATUS_COMMAND and len(part.arguments) > 2
