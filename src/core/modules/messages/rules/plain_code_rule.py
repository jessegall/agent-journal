from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.messages.lines.plain_code_lines import PlainCodeLines


class PlainCodeRule(DriverRule):
    """The old walk's answer for PlainCodeLines, which owns it, until the walk is deleted."""

    name = PlainCodeLines.key
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def __init__(self, lines: PlainCodeLines) -> None:
        self.lines = lines

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudges = self.lines.nudges(hook.event, hook.agent_id)
        return RuleAnswer.with_nudges(*nudges) if nudges else RuleAnswer.allowed()
