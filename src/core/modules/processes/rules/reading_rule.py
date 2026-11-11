from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.processes.support.reading.reading_enforcer import ReadingEnforcer


class ReadingRule(DriverRule):
    """Answers a tool use with what the reading enforcer says, for every role."""

    name = "processes.reading"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def __init__(self, enforcer: ReadingEnforcer) -> None:
        self.enforcer = enforcer

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if ReadingEnforcer.answers_exit(hook):
            return RuleAnswer.allowed()
        return self.enforcer.answer(hook)
