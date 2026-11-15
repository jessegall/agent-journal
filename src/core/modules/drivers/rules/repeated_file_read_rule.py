from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.drivers.lines.repeated_file_read_lines import RepeatedFileReadLines


class RepeatedFileReadRule(DriverRule):
    """The old walk's answer for RepeatedFileReadLines, which owns it, until the walk is deleted."""

    name = RepeatedFileReadLines.key
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def __init__(self, lines: RepeatedFileReadLines) -> None:
        self.lines = lines

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudges = self.lines.nudges(hook.event, hook.agent_id)
        return RuleAnswer.with_nudges(*nudges) if nudges else RuleAnswer.allowed()
