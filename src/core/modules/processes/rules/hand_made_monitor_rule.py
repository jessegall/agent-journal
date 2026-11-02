from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.tool_type import ToolType
from core.modules.processes.support.process_nudges import HAND_MADE_MONITOR, MONITOR_TOOL_REQUIRED

OUTPUT_LINE = "journal output "
MONITOR_LINE = "journal output monitor "


class HandMadeMonitorRule(DriverRule):
    """A Monitor that loops over an output by hand is refused: its match can miss the end of the run, and the
    command made for it cannot. That command runs only in a Monitor: as a plain command it blocks the agent."""

    name = "processes.hand-made-monitor"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is not None and tool.shell is not None and any(part.text.startswith(MONITOR_LINE) for part in tool.shell.parts):
            return RuleAnswer.refused(MONITOR_TOOL_REQUIRED.nudge())
        if tool is None or tool.category != ToolType.MONITOR:
            return RuleAnswer.allowed()
        command = str(hook.event.tool_input().get("command", ""))
        if OUTPUT_LINE in command and MONITOR_LINE not in command:
            return RuleAnswer.refused(HAND_MADE_MONITOR.nudge())
        return RuleAnswer.allowed()
