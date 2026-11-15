from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.waits.lines.long_wait_lines import LONG_WAIT_RULE, LongWaitLines


class LongWaitRule(DriverRule):
    """The old walk's answer for LongWaitLines, which owns it, until the walk is deleted."""

    name = LONG_WAIT_RULE
    hook = HookEventName.TICK

    def __init__(self, lines: LongWaitLines) -> None:
        self.lines = lines

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudges = self.lines.nudges(hook.agent_id)
        return RuleAnswer.with_nudges(*nudges) if nudges else RuleAnswer.allowed()
