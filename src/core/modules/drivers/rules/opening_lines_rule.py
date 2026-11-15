from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.drivers.lines.opening_lines_lines import OpeningLinesLines


class OpeningLinesRule(DriverRule):
    """The old walk's answer for OpeningLinesLines, which owns it, until the walk is deleted."""

    name = OpeningLinesLines.key
    start_line_rule = True
    hook = HookEventName.SESSION_START
    drivers = ["*"]

    def __init__(self, lines: OpeningLinesLines) -> None:
        self.lines = lines

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.with_nudges(*self.lines.driver_lines(hook.driver))
