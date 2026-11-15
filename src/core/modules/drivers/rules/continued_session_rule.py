from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from engine.enums.agent_role import AgentRole
from core.modules.drivers.lines.continued_session_lines import ContinuedSessionLines


class ContinuedSessionRule(DriverRule):
    """The old walk's answer for ContinuedSessionLines, which owns it, until the walk is deleted."""

    name = ContinuedSessionLines.key
    hook = HookEventName.SESSION_START
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, lines: ContinuedSessionLines) -> None:
        self.lines = lines

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudges = self.lines.nudges(hook.event, hook.agent_id)
        return RuleAnswer.with_nudges(*nudges) if nudges else RuleAnswer.allowed()
