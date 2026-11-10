from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.enums.tool_type import ToolType
from engine.provider.providers import Providers
from core.modules.processes.support.process_nudges import HAND_MADE_MONITOR, MONITOR_TOOL_REQUIRED

OUTPUT_LINE = "journal output "
MONITOR_LINE = "journal output monitor "


class HandMadeMonitorRule(DriverRule):
    """A Monitor that loops over an output by hand is refused: its match can miss the end of the run, and the
    command made for it cannot. Where the program has a Monitor tool, that command runs only in it: as a plain
    command it blocks the agent. A program with no Monitor tool runs it in its shell, which is how it watches."""

    name = "processes.hand-made-monitor"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    refuses_one_action = "A Monitor that loops over an output by hand is refused"

    def __init__(self, providers: Providers) -> None:
        self.providers = providers

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if self.providers.provider(hook.event.program).monitor_tool is not ToolType.MONITOR:
            return RuleAnswer.allowed()
        if tool is not None and tool.shell is not None and any(part.text.startswith(MONITOR_LINE) for part in tool.shell.parts):
            return RuleAnswer.refused(MONITOR_TOOL_REQUIRED.nudge())
        if tool is None or tool.category != ToolType.MONITOR:
            return RuleAnswer.allowed()
        command = str(hook.event.tool_input().get("command", ""))
        if OUTPUT_LINE in command and MONITOR_LINE not in command:
            return RuleAnswer.refused(HAND_MADE_MONITOR.nudge())
        return RuleAnswer.allowed()
