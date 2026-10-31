from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.registry.registry import Registry


class OpeningLinesRule(DriverRule):
    """A session's start gives the agent its driver's opening lines."""

    name = "drivers.opening-lines"
    hook = HookEventName.SESSION_START
    drivers = ["*"]

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def answer(self, hook: AgentHook) -> RuleAnswer:
        driver = self.registry.driver(hook.driver)
        return RuleAnswer.with_lines(*driver.opening_lines) if driver is not None and driver.opening_lines else RuleAnswer.allowed()
