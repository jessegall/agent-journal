from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.lines.output_status_monitor_lines import OutputStatusMonitorLines


class OutputStatusMonitorRule(DriverRule):
    """The old walk's answer for OutputStatusMonitorLines, which owns it, until the walk is deleted."""

    name = OutputStatusMonitorLines.key
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def __init__(self, lines: OutputStatusMonitorLines) -> None:
        self.lines = lines

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.with_nudges(*self.lines.nudges(hook.event, hook.agent_id))
