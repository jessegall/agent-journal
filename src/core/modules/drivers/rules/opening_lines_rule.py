from core.modules.drivers.support.driver_nudges import OPENING_LINE
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.registry.registry import Registry


class OpeningLinesRule(DriverRule):
    """A session's start gives the agent its driver's opening lines."""

    name = "drivers.opening-lines"
    start_line_rule = True
    hook = HookEventName.SESSION_START
    drivers = ["*"]

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def answer(self, hook: AgentHook) -> RuleAnswer:
        driver = self.registry.driver(hook.driver)
        return RuleAnswer.with_nudges(*(OPENING_LINE.nudge(text=line) for line in driver.opening_lines)) if driver is not None and driver.opening_lines else RuleAnswer.allowed()
